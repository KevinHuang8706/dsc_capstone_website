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

// 3. Updated PCA Loadings for the Heatmap Toggle
const pcaLoadingsData = [
    [0, 0, -0.899], [0, 1, -0.877], [0, 2, 0.733], [0, 3, 0.304], [0, 4, 0.839], [0, 5, 0.739], [0, 6, -0.346], [0, 7, 0.655],
    [1, 0, 0.145],  [1, 1, 0.068],  [1, 2, -0.298], [1, 3, 0.478], [1, 4, -0.159], [1, 5, 0.412], [1, 6, 0.777], [1, 7, 0.552],
    [2, 0, 0.155],  [2, 1, 0.154],  [2, 2, 0.073],  [2, 3, 0.803], [2, 4, 0.077],  [2, 5, -0.250], [2, 6, -0.339], [2, 7, -0.030],
    [3, 0, 0.030],  [3, 1, -0.131], [3, 2, -0.554], [3, 3, -0.074], [3, 4, 0.108],  [3, 5, -0.045], [3, 6, -0.308], [3, 7, 0.271],
    [4, 0, -0.158], [4, 1, -0.284], [4, 2, -0.183], [4, 3, 0.162], [4, 4, -0.283], [4, 5, 0.194], [4, 6, -0.033], [4, 7, -0.342],
    [5, 0, 0.188],  [5, 1, 0.175],  [5, 2, -0.076], [5, 3, -0.009], [5, 4, 0.276],  [5, 5, 0.363], [5, 6, -0.059], [5, 7, -0.213],
    [6, 0, 0.064],  [6, 1, 0.138],  [6, 2, 0.123],  [6, 3, -0.050], [6, 4, -0.311], [6, 5, 0.223], [6, 6, -0.251], [6, 7, 0.173],
    [7, 0, -0.284], [7, 1, 0.232],  [7, 2, -0.079], [7, 3, 0.018], [7, 4, 0.007],  [7, 5, 0.005], [7, 6, 0.000],  [7, 7, -0.014],
];

// 4. Updated Scatter Raw Data for the Scatter Plot and Angle Calculator
const scatterDataRaw = [
    { name: 'PC1 Gene Expression', value: [-0.899, 0.145], cluster: 1, originalIndex: 0 },
    { name: 'T1w/T2w Ratio (Myelin)', value: [-0.877, 0.068], cluster: 1, originalIndex: 1 },
    { name: 'Cortical Thickness', value: [0.733, -0.298], cluster: 2, originalIndex: 2 },
    { name: 'Allometric Scaling (NIH)', value: [0.304, 0.478], cluster: 2, originalIndex: 3 },
    { name: '5-HT1a Receptor', value: [0.839, -0.159], cluster: 2, originalIndex: 4 },
    { name: 'Functional Gradient', value: [0.739, 0.412], cluster: 2, originalIndex: 5 },
    { name: 'Glucose Metabolism', value: [-0.346, 0.777], cluster: 1, originalIndex: 6 },
    { name: 'Intersubject Variability', value: [0.655, 0.552], cluster: 2, originalIndex: 7 },
];

const pcaScatterChart = echarts.init(document.getElementById('pca-scatter-container'));
let clustersEnabled = false;
let selectedPoints = []; 

function getScatterColor(clusterNum) {
    if (!clustersEnabled) return '#2563eb'; 
    return clusterNum === 1 ? '#f97316' : '#22c55e'; 
}

function renderScatter() {
    // Update the Clear Button State
    const resetBtn = document.getElementById('reset-scatter-btn');
    if (selectedPoints.length === 0) {
        resetBtn.style.background = '#e2e8f0';
        resetBtn.style.color = '#94a3b8';
        resetBtn.style.cursor = 'not-allowed';
    } else {
        resetBtn.style.background = '#ef4444';
        resetBtn.style.color = 'white';
        resetBtn.style.cursor = 'pointer';
    }

    const formattedData = scatterDataRaw.map(item => ({
        ...item,
        itemStyle: { 
            color: getScatterColor(item.cluster),
            shadowBlur: selectedPoints.some(p => p.name === item.name) ? 10 : 0,
            shadowColor: '#000'
        },
        symbolSize: selectedPoints.some(p => p.name === item.name) ? 18 : 12
    }));

    const linesData = selectedPoints.map(p => ({
        coords: [[0, 0], p.value],
        lineStyle: { type: 'solid', color: getScatterColor(p.cluster), width: 3 }
    }));

    let graphicElements = [];
    let seriesData = [
        {
            type: 'scatter',
            data: formattedData,
            label: {
                show: true, position: 'right', formatter: '{b}',
                fontSize: 12, fontWeight: 'bold', color: '#475569'
            }
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
        
        // Math Calculations
        const approxCorr = (p1.value[0] * p2.value[0]) + (p1.value[1] * p2.value[1]);
        const mag1 = Math.sqrt(p1.value[0]**2 + p1.value[1]**2);
        const mag2 = Math.sqrt(p2.value[0]**2 + p2.value[1]**2);
        
        let cosTheta = approxCorr / (mag1 * mag2);
        cosTheta = Math.max(-1, Math.min(1, cosTheta));
        const angleDeg = Math.acos(cosTheta) * (180 / Math.PI);
        
        // Secure lookup from local array
        const actualRho = scatterCorrData[p1.originalIndex][p2.originalIndex];

        // Draw the Angle Arc
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
                    shape: {
                        cx: p0[0], cy: p0[1], r: 35, 
                        startAngle: a1, endAngle: a2, clockwise: clockwise
                    },
                    style: {
                        stroke: '#475569', fill: 'transparent',
                        lineWidth: 2, lineDash: [4, 4] 
                    }
                };
            },
            z: 10
        });

        // Overlay Box with stats
        graphicElements = [{
            type: 'group',
            left: '12%', 
            bottom: '18%',
            children: [
                {
                    type: 'rect',
                    z: 100,
                    shape: { width: 240, height: 85, r: 8 },
                    style: { fill: 'rgba(241, 245, 249, 0.9)', stroke: '#cbd5e1', lineWidth: 1 }
                },
                {
                    type: 'text',
                    z: 101,
                    left: 12,
                    top: 12,
                    style: {
                        text: `Angle (θ): ${angleDeg.toFixed(1)}°\nApprox Corr (Cos θ): ${approxCorr.toFixed(3)}\nActual Corr (ρ): ${actualRho.toFixed(3)}`,
                        font: 'bold 13px sans-serif',
                        fill: '#1e293b',
                        lineHeight: 22
                    }
                }
            ]
        }];
    }

    const option = {
        grid: { top: '5%', bottom: '15%', left: '10%', right: '15%', containLabel: true },
        tooltip: {
            formatter: function(params) {
                if(params.seriesType === 'scatter') {
                    return `<strong>${params.data.name}</strong><br/>PC1: ${params.value[0].toFixed(3)}<br/>PC2: ${params.value[1].toFixed(3)}`;
                }
            }
        },
        xAxis: { 
            type: 'value', name: 'PC1 Loading', nameLocation: 'middle', nameGap: 30,
            min: -1, max: 1, 
            axisLine: { onZero: true, lineStyle: { color: '#1e293b', width: 2 } }, 
            splitLine: { lineStyle: { type: 'dashed' } }
        },
        yAxis: { 
            type: 'value', name: 'PC2 Loading', nameLocation: 'middle', nameGap: 40,
            min: -1, max: 1, 
            axisLine: { onZero: true, lineStyle: { color: '#1e293b', width: 2 } }, 
            splitLine: { lineStyle: { type: 'dashed' } }
        },
        graphic: graphicElements, 
        series: seriesData
    };
    pcaScatterChart.setOption(option, true); 
}

// Initial Render
renderScatter();

// Handle Clicking Points (Anchoring Logic)
pcaScatterChart.on('click', function (params) {
    if (params.seriesType === 'scatter') {
        const idx = selectedPoints.findIndex(p => p.name === params.data.name);
        
        if (idx > -1) {
            // Deselect if already selected
            selectedPoints.splice(idx, 1);
        } else {
            if (selectedPoints.length >= 2) {
                // Keep the 1st point anchored, swap out the 2nd point
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

    infoBox.innerHTML = `
        <div style="display: flex; justify-content: space-around; font-size: 0.95rem; text-align: left;">
            <div style="flex: 1; padding: 0 10px;">
                <strong>Selected:</strong><br/>
                <span style="color:${getScatterColor(p1.cluster)}; font-weight: bold;">${p1.name}</span><br/>
                <span style="color:${getScatterColor(p2.cluster)}; font-weight: bold;">${p2.name}</span>
            </div>
            <div style="flex: 1; padding: 0 10px; border-left: 2px solid #e2e8f0;">
                <strong>Cluster Subgroup:</strong><br/>
                <span style="color:#475569">Cluster ${p1.cluster}</span><br/>
                <span style="color:#475569">Cluster ${p2.cluster}</span>
            </div>
        </div>
    `;
}

// Button: Reset Selection
document.getElementById('reset-scatter-btn').addEventListener('click', function() {
    if(selectedPoints.length === 0) return; 
    selectedPoints = [];
    renderScatter();
    updateInfoBox();
});

// Button: Cluster Toggle
document.getElementById('cluster-toggle-btn').addEventListener('click', function(e) {
    clustersEnabled = !clustersEnabled;
    
    if(clustersEnabled) {
        e.target.innerText = "Turn Clusters Off";
        e.target.style.background = '#1e293b';
        e.target.style.color = '#ffffff';
        e.target.style.borderColor = '#1e293b';
    } else {
        e.target.innerText = "Turn Clusters On";
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