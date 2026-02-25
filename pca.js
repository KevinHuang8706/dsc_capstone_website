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
const varianceExplained = [50.10, 18.08, 11.02, 6.41, 5.01, 4.11, 3.50, 1.77];

// PCA Loadings Data [x_index, y_index, value]
const pcaLoadingsData = [
    [0, 0, 0.771], [1, 0, -0.400], [2, 0, 0.046], [3, 0, 0.287], [4, 0, 0.354], [5, 0, 0.165], [6, 0, -0.065], [7, 0, -0.038],
    [0, 1, 0.796], [1, 1, -0.329], [2, 1, 0.052], [3, 1, -0.380], [4, 1, -0.169], [5, 1, -0.222], [6, 1,  0.183], [7, 1,  0.037],
    [0, 2, -0.672],[1, 2, -0.428], [2, 2, -0.395], [3, 2, 0.038], [4, 2, -0.270], [5, 2, -0.189], [6, 2,  0.301], [7, 2,  0.050],
    [0, 3, -0.218],[1, 3, -0.058], [2, 3,  0.887], [3, 3, 0.211], [4, 3,  0.021], [5, 3, -0.198], [6, 3,  0.286], [7, 3,  0.027],
    [0, 4, -0.803],[1, 4,  0.225], [2, 4, -0.138], [3, 4, -0.015], [4, 4,  0.428], [5, 4,  0.134], [6, 4, -0.197], [7, 4,  0.212],
    [0, 5, -0.737],[1, 5,  0.437], [2, 5,  0.076], [3, 5,  0.070], [4, 5, -0.203], [5, 5, -0.170], [6, 5,  0.324], [7, 5, -0.279],
    [0, 6,  0.359],[1, 6,  0.169], [2, 6, -0.176], [3, 6, -0.124], [4, 6,  0.316], [5, 6, -0.751], [6, 6, -0.019], [7, 6, -0.360],
    [0, 7, -0.669],[1, 7, -0.528], [2, 7,  0.215], [3, 7, -0.128], [4, 7,  0.176], [5, 7,  0.057], [6, 7, -0.344], [7, 7, -0.223]
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