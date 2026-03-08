// ==========================================
// INTERACTIVE PCA SCATTER PLOT (VECTORS)
// ==========================================

// 1. Updated Variance Explained
const varianceExplained = [50.10, 18.08, 11.02, 6.41, 5.01, 4.11, 3.50, 1.77];

// 2. Updated Correlation Matrix (for Angle Comparison)
const scatterCorrData = [
    [ 1.000,  0.840, -0.663, -0.117, -0.688, -0.595,  0.341, -0.476],
    [ 0.840,  1.000, -0.543, -0.151, -0.662, -0.613,  0.309, -0.496],
    [-0.663, -0.543,  1.000,  0.143,  0.600,  0.390, -0.360,  0.265],
    [-0.117, -0.151,  0.143,  1.000,  0.200,  0.241,  0.025,  0.356],
    [-0.688, -0.662,  0.600,  0.200,  1.000,  0.507, -0.402,  0.473],
    [-0.595, -0.613,  0.390,  0.241,  0.507,  1.000,  0.079,  0.602],
    [ 0.341,  0.309, -0.360,  0.025, -0.402,  0.079,  1.000,  0.109],
    [-0.476, -0.496,  0.265,  0.356,  0.473,  0.602,  0.109,  1.000],
];

// 3. Raw Data with BOTH Cluster (1 or 2) and Identity (Structural or Functional)
const scatterDataRaw = [
    { name: 'PC1 Gene Expression', value: [-0.899, 0.145], cluster: 1, originalIndex: 0, identity: 'structural' },
    { name: 'T1w/T2w Ratio (Myelin)', value: [-0.877, 0.068], cluster: 1, originalIndex: 1, identity: 'structural' },
    { name: 'Cortical Thickness', value: [0.733, -0.298], cluster: 2, originalIndex: 2, identity: 'structural' },
    { name: 'Allometric Scaling (NIH)', value: [0.304, 0.478], cluster: 2, originalIndex: 3, identity: 'structural' },
    { name: '5-HT1a Receptor', value: [0.839, -0.159], cluster: 2, originalIndex: 4, identity: 'functional' },
    { name: 'Functional Gradient', value: [0.739, 0.412], cluster: 2, originalIndex: 5, identity: 'functional' },
    { name: 'Glucose Metabolism', value: [-0.346, 0.777], cluster: 1, originalIndex: 6, identity: 'functional' },
    { name: 'Intersubject Variability', value: [0.655, 0.552], cluster: 2, originalIndex: 7, identity: 'functional' },
];

const pcaScatterChart = echarts.init(document.getElementById('pca-scatter-container'));
let clustersEnabled = false;
let selectedPoints = []; 

// FIX: Dot Color relies purely on the Hierarchical CLUSTER (Orange/Green)
function getScatterColor(clusterNum) {
    if (!clustersEnabled) return '#1e293b'; // Initial State: Black
    return clusterNum === 1 ? '#f97316' : '#22c55e'; // Cluster 1: Orange, Cluster 2: Green
}

function renderScatter() {
    const resetBtn = document.getElementById('reset-scatter-btn');
    if (selectedPoints.length === 0) {
        resetBtn.style.background = '#e2e8f0';
        resetBtn.style.color = '#94a3b8';
        resetBtn.style.cursor = 'not-allowed';
    } else {
        resetBtn.style.background = '#1e293b';
        resetBtn.style.color = 'white';
        resetBtn.style.cursor = 'pointer';
    }

    const formattedData = scatterDataRaw.map(item => ({
        ...item,
        itemStyle: { 
            color: getScatterColor(item.cluster), // Dots colored by cluster
            shadowBlur: selectedPoints.some(p => p.name === item.name) ? 10 : 0,
            shadowColor: '#000'
        },
        symbolSize: selectedPoints.some(p => p.name === item.name) ? 18 : 12,
        label: {
            show: true,
            position: 'right',
            formatter: function(params) {
                // FIX: Triangles rely purely on the true biological IDENTITY (Blue/Red)
                if (clustersEnabled) {
                    if (params.data.identity === 'structural') {
                        return `{structural|◀} {text|${params.name}}`;
                    } else if (params.data.identity === 'functional') {
                        return `{functional|◀} {text|${params.name}}`;
                    }
                }
                return `{plain|${params.name}}`; // Plain text when toggle is off
            },
            rich: {
                structural: { color: '#2563eb', fontSize: 14, padding: [0, 2, 0, 0] },
                functional: { color: '#ef4444', fontSize: 14, padding: [0, 2, 0, 0] },
                text: { color: '#1e293b', fontSize: 12, fontWeight: 'bold' },
                plain: { color: '#475569', fontSize: 12, fontWeight: 'bold' }
            }
        }
    }));

    const linesData = selectedPoints.map(p => ({
        coords: [[0, 0], p.value],
        lineStyle: { type: 'solid', color: getScatterColor(p.cluster), width: 3 }
    }));

    let graphicElements = [];
    let seriesData = [
        {
            type: 'scatter',
            data: formattedData
        },
        {
            type: 'lines',
            coordinateSystem: 'cartesian2d',
            data: linesData,
            symbol: ['none', 'arrow'], 
            symbolSize: 10,
            animationDurationUpdate: 300
        }
    ];

    if (selectedPoints.length === 2) {
        const p1 = selectedPoints[0];
        const p2 = selectedPoints[1];
        
        const approxCorr = (p1.value[0] * p2.value[0]) + (p1.value[1] * p2.value[1]);
        const mag1 = Math.sqrt(p1.value[0]**2 + p1.value[1]**2);
        const mag2 = Math.sqrt(p2.value[0]**2 + p2.value[1]**2);
        
        let cosTheta = approxCorr / (mag1 * mag2);
        cosTheta = Math.max(-1, Math.min(1, cosTheta));
        const angleDeg = Math.acos(cosTheta) * (180 / Math.PI);
        const actualRho = scatterCorrData[p1.originalIndex][p2.originalIndex];

        seriesData.push({
            type: 'custom',
            coordinateSystem: 'cartesian2d',
            data: [[0, 0]], 
            renderItem: function (params, api) {
                const p0 = api.coord([0, 0]);
                const pt1 = api.coord([p1.value[0], p1.value[1]]);
                const pt2 = api.coord([p2.value[0], p2.value[1]]);
                
                let a1 = Math.atan2(pt1[1] - p0[1], pt1[0] - p0[0]);
                let a2 = Math.atan2(pt2[1] - p0[1], pt2[0] - p0[0]);
                
                let diff = a2 - a1;
                if (diff > Math.PI) a2 -= 2 * Math.PI;
                if (diff < -Math.PI) a2 += 2 * Math.PI;
                const clockwise = a2 > a1;

                return {
                    type: 'arc',
                    shape: { cx: p0[0], cy: p0[1], r: 35, startAngle: a1, endAngle: a2, clockwise: clockwise },
                    style: { stroke: '#475569', fill: 'transparent', lineWidth: 2, lineDash: [4, 4] }
                };
            },
            z: 10
        });

        graphicElements = [{
            type: 'group',
            left: '5%',   
            bottom: '10%', 
            children: [
                {
                    type: 'rect', z: 100,
                    shape: { width: 240, height: 85, r: 8 },
                    style: { fill: 'rgba(241, 245, 249, 0.9)', stroke: '#cbd5e1', lineWidth: 1 }
                },
                {
                    type: 'text', z: 101, left: 12, top: 12,
                    style: {
                        text: `Angle (θ): ${angleDeg.toFixed(1)}°\nApprox Corr (Cos θ): ${approxCorr.toFixed(3)}\nActual Corr (ρ): ${actualRho.toFixed(3)}`,
                        font: 'bold 13px sans-serif', fill: '#1e293b', lineHeight: 22
                    }
                }
            ]
        }];
    } 

    const option = {
        grid: { top: '5%', bottom: '5%', left: '5%', right: '5%' }, 
        tooltip: {
            formatter: function(params) {
                if(params.seriesType === 'scatter') {
                    const idText = params.data.identity === 'structural' ? 'Structural' : 'Functional';
                    return `<strong>${params.data.name}</strong><br/>Identity: ${idText}<br/>Cluster: ${params.data.cluster}<br/>PC1: ${params.value[0].toFixed(3)}<br/>PC2: ${params.value[1].toFixed(3)}`;
                }
            }
        },
        xAxis: { 
            type: 'value', name: 'PC1 Loading', nameLocation: 'middle', nameGap: 30,
            min: -1.3, max: 1.3, 
            axisLine: { onZero: true, lineStyle: { color: '#1e293b', width: 2 } }, 
            splitLine: { lineStyle: { type: 'dashed' } }
        },
        yAxis: { 
            type: 'value', name: 'PC2 Loading', nameLocation: 'middle', nameGap: 40,
            min: -1.3, max: 1.3, 
            axisLine: { onZero: true, lineStyle: { color: '#1e293b', width: 2 } }, 
            splitLine: { lineStyle: { type: 'dashed' } }
        },
        graphic: graphicElements, 
        series: seriesData
    };
    pcaScatterChart.setOption(option, true);
}

renderScatter();

pcaScatterChart.on('click', function (params) {
    if (params.seriesType === 'scatter') {
        const idx = selectedPoints.findIndex(p => p.name === params.data.name);
        
        if (idx > -1) {
            selectedPoints.splice(idx, 1);
        } else {
            if (selectedPoints.length >= 2) {
                selectedPoints[1] = params.data; 
            } else {
                selectedPoints.push(params.data);
            }
        }
        
        renderScatter();
        updateInfoBox();
    }
});

const infoBox = document.getElementById('scatter-info-box');

function updateInfoBox() {
    if (selectedPoints.length < 2) {
        infoBox.innerHTML = `<em>Click on any two points in the plot above to compare their vectors.</em>`;
        return;
    }

    const p1 = selectedPoints[0];
    const p2 = selectedPoints[1];

    const formatIdentity = (identity) => {
        if (!clustersEnabled) return `<span style="color:#94a3b8; font-weight:normal;">Turn toggle on</span>`;
        if (identity === 'structural') return `<span style="color:#2563eb; font-weight:bold;">◀ Structural</span>`;
        return `<span style="color:#ef4444; font-weight:bold;">◀ Functional</span>`;
    };

    const formatCluster = (cluster) => {
        if (!clustersEnabled) return `<span style="color:#94a3b8; font-weight:normal;">Turn toggle on</span>`;
        const color = cluster === 1 ? '#f97316' : '#22c55e';
        return `<span style="color:${color}; font-weight:bold;">Cluster ${cluster}</span>`;
    };

    infoBox.innerHTML = `
        <div style="display: flex; justify-content: space-around; font-size: 0.95rem; text-align: left;">
            <div style="flex: 1; padding: 0 10px;">
                <strong>Selected Maps:</strong><br/>
                <span style="color:${getScatterColor(p1.cluster)}; font-weight: bold;">${p1.name}</span><br/>
                <span style="color:${getScatterColor(p2.cluster)}; font-weight: bold;">${p2.name}</span>
            </div>
            <div style="flex: 1; padding: 0 10px; border-left: 2px solid #e2e8f0;">
                <strong>True Identity:</strong><br/>
                ${formatIdentity(p1.identity)}<br/>
                ${formatIdentity(p2.identity)}
            </div>
            <div style="flex: 1; padding: 0 10px; border-left: 2px solid #e2e8f0;">
                <strong>Clustering Subgroup:</strong><br/>
                ${formatCluster(p1.cluster)}<br/>
                ${formatCluster(p2.cluster)}
            </div>
        </div>
    `;
}

document.getElementById('reset-scatter-btn').addEventListener('click', function() {
    if(selectedPoints.length === 0) return; 
    selectedPoints = [];
    renderScatter();
    updateInfoBox();
});

document.getElementById('cluster-toggle-btn').addEventListener('click', function(e) {
    clustersEnabled = !clustersEnabled;
    
    if(clustersEnabled) {
        e.target.innerText = "Hide Biological Traits";
        e.target.style.background = '#1e293b';
        e.target.style.color = '#ffffff';
        e.target.style.borderColor = '#1e293b';
    } else {
        e.target.innerText = "Show Biological Traits";
        e.target.style.background = 'white';
        e.target.style.color = '#475569';
        e.target.style.borderColor = '#cbd5e1';
    }
    
    renderScatter();
    updateInfoBox();
});

window.addEventListener('resize', () => {
    pcaScatterChart.resize();
});