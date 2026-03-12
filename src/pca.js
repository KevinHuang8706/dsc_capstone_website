// INTERACTIVE PCA VISUALIZATIONS (ECHARTS)
// 1. Data Definitions
const mapNames = [
    'PC1 Gene Expression', 
    'T1w/T2w Ratio (Myelin)', 
    'Cortical Thickness', 
    'Allometric Scaling (NIH)', 
    '5-HT1a Receptor', 
    'Functional Gradient', 
    'Glucose Metabolism', 
    'Intersubject Variability'
];

const pcLabels = ['PC1', 'PC2', 'PC3', 'PC4', 'PC5', 'PC6', 'PC7', 'PC8'];
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
// 2. Initialize PCA Heatmap
const pcaHeatmapChart = echarts.init(document.getElementById('pca-heatmap-container'));
pcaHeatmapChart.setOption({
    tooltip: {
        position: 'top',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        textStyle: { color: '#fff' },
        formatter: function (params) {
            return `<strong>${mapNames[params.value[1]]}</strong> on <strong>${pcLabels[params.value[0]]}</strong><br/>Loading: ${params.value[2].toFixed(3)}`;
        }
    },
    grid: { 
        top: '10%', 
        bottom: '15%', 
        right: '15%', 
        left: '3%', 
        containLabel: true
    },
    xAxis: { type: 'category', data: pcLabels, splitArea: { show: true } },
    yAxis: { type: 'category', data: mapNames, splitArea: { show: true }, axisLabel: { fontWeight: 'bold' } },
    visualMap: {
        min: -1, 
        max: 1, 
        calculable: true, // Enables the draggable slider handles to filter grids
        realtime: true,   // Updates the filtered grids in real-time as you drag
        orient: 'vertical', 
        right: '0%', 
        top: 'center',
        inRange: { 
            color: ['#2563eb', '#ffffff', '#ef4444'] // Blue to Red
        },
        // Precise formatting so the bar shows exactly 0.77 instead of "+0"
        formatter: function (value) {
            return value.toFixed(2); 
        },
        // Clear labels at the top and bottom of the bar for better intuition
        text: ['Strong Positive (+1)', 'Strong Negative (-1)'],
        textStyle: {
            fontSize: 11,
            fontWeight: 'bold',
            color: '#475569'
        }
    },
    series: [{
        type: 'heatmap', data: pcaLoadingsData,
        label: { show: true, formatter: function(p) { return p.value[2].toFixed(2); }, color: '#000' },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
    }]
});

// 3. Initialize PCA Scree Plot
const pcaScreeChart = echarts.init(document.getElementById('pca-scree-container'));
pcaScreeChart.setOption({
    tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        textStyle: { color: '#fff' },
        formatter: function (params) {
            return `<strong>${params[0].name}</strong><br/>Variance Explained: ${params[0].value.toFixed(2)}%`;
        }
    },
    grid: { top: '15%', bottom: '15%', left: '10%', right: '10%' },
    xAxis: { type: 'category', data: pcLabels, axisLine: { lineStyle: { color: '#475569' } }, axisLabel: { fontWeight: 'bold' } },
    yAxis: {
        type: 'value', 
        name: 'Variance Explained (%)', 
        nameLocation: 'middle', 
        nameGap: 50, // Increased gap slightly so the larger text doesn't hit the numbers
        nameTextStyle: {
            fontSize: 16,     // <-- Increases the size of "Variance Explained (%)"
            color: '#1e293b'
        },
        axisLabel: {
            fontSize: 14,     // <-- Increases the size of the numbers (0, 10, 20, etc.)
            color: '#475569'
        },
        axisLine: { show: true, lineStyle: { color: '#475569' } }, 
        splitLine: { lineStyle: { type: 'dashed' } }
    },
    series: [{
        data: varianceExplained, 
        type: 'line', 
        symbol: 'circle', 
        symbolSize: 12,
        itemStyle: { color: '#2563eb' }, 
        lineStyle: { width: 3 },
        label: { 
            show: true, 
            position: 'top', 
            formatter: '{c}%',
            color: '#1e293b',
            fontSize: 15,       // Increases the text size
            distance: 12        // Add this: Adds a little padding above the dot
        }
    }]
});

// 4. Toggle Logic
const toggleBtns = document.querySelectorAll('.pca-toggle-btn');
toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Update active class
        toggleBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // Hide both containers
        document.getElementById('pca-heatmap-container').style.display = 'none';
        document.getElementById('pca-scree-container').style.display = 'none';

        // Show targeted container
        const targetId = e.target.getAttribute('data-target');
        const targetContainer = document.getElementById(targetId);
        targetContainer.style.display = 'block';

        // Resize the newly visible chart to ensure it fits the container
        if (targetId === 'pca-heatmap-container') {
            pcaHeatmapChart.resize();
        } else {
            pcaScreeChart.resize();
        }
    });
});

// 5. Handle Window Resize
window.addEventListener('resize', () => {
    // Only resize the currently visible chart to prevent width collapse
    if (document.getElementById('pca-heatmap-container').style.display !== 'none') {
        pcaHeatmapChart.resize();
    } else {
        pcaScreeChart.resize();
    }
});