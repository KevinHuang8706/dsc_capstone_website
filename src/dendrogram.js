// INTERACTIVE DENDROGRAM LOGIC (ECHARTS)

// Initialize ECharts instance on the container
const dendrogramContainer = document.getElementById('dendrogram-container');
const dendrogramChart = echarts.init(dendrogramContainer);

// Define the hierarchical data based on the subgroup analysis
// Added `identity` to leaf nodes to easily map them to their true biological categories
const dendrogramData = {
    name: 'Cortical\nMaps',
    children: [
        {
            name: 'Cluster 1',
            itemStyle: { color: '#f97316' }, // Orange for Structural Cluster
            children: [
                {
                    name: 'PC1 & Myelin',
                    itemStyle: { color: '#f97316' },
                    children: [
                        { name: 'PC1 Gene Expression', value: 'Cluster 1: Strong coupling (ρ=0.84)', itemStyle: { color: '#f97316' }, identity: 'structural' },
                        { name: 'T1w/T2w Ratio (Myelin)', value: 'Cluster 1: Strong coupling (ρ=0.84)', itemStyle: { color: '#f97316' }, identity: 'structural' }
                    ]
                },
                { name: 'Glucose Metabolism', value: 'Cluster 1: Metabolic layer', itemStyle: { color: '#f97316' }, identity: 'functional' }
            ]
        },
        {
            name: 'Cluster 2',
            itemStyle: { color: '#22c55e' }, // Green for Functional Cluster
            children: [
                {
                    name: 'Thickness & 5-HT1a',
                    itemStyle: { color: '#22c55e' },
                    children: [
                        { name: 'Cortical Thickness', value: 'Cluster 2: Coupled with 5-HT1a', itemStyle: { color: '#22c55e' }, identity: 'structural' },
                        { name: '5-HT1a Receptor', value: 'Cluster 2: Coupled with Thickness', itemStyle: { color: '#22c55e' }, identity: 'functional' }
                    ]
                },
                {
                    name: 'Grad & Var',
                    itemStyle: { color: '#22c55e' },
                    children: [
                        { name: 'Functional Gradient', value: 'Cluster 2: Coupled with Variability', itemStyle: { color: '#22c55e' }, identity: 'functional' },
                        { name: 'Intersubject Variability', value: 'Cluster 2: Coupled with Gradient', itemStyle: { color: '#22c55e' }, identity: 'functional' }
                    ]
                },
                { name: 'Allometric Scaling (NIH)', value: 'Cluster 2: Morphological scaling', itemStyle: { color: '#22c55e' }, identity: 'structural' }
            ]
        }
    ]
};

// Configure the chart options
// Configure the chart options
const dendrogramOption = {
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        textStyle: { color: '#fff' },
        borderWidth: 0,
        formatter: function (params) {
            if (params.data.identity) {
                const type = params.data.identity === 'structural' ? 'Roads (Structure)' : 'Traffic (Function)';
                return `<strong>${params.name}</strong><br/>True Identity: ${type}<br/>${params.value}`;
            }
            return `<strong>${params.name.replace('\n', ' ')}</strong>`;
        }
    },
    // NEW: Custom Floating Legend for Map Identities
    graphic: [
        {
            type: 'group',
            left: '5%',
            bottom: '5%',
            children: [
                {
                    type: 'rect',
                    z: 100,
                    shape: { width: 185, height: 75, r: 6 },
                    style: { fill: 'rgba(248, 250, 252, 0.9)', stroke: '#cbd5e1', lineWidth: 1 }
                },
                {
                    type: 'text',
                    z: 101,
                    left: 12,
                    top: 12,
                    style: {
                        text: 'Map Identity Legend',
                        font: 'bold 13px sans-serif',
                        fill: '#1e293b'
                    }
                },
                {
                    type: 'text',
                    z: 101,
                    left: 12,
                    top: 35,
                    style: {
                        text: '◀',
                        font: '14px sans-serif',
                        fill: '#2563eb' // Blue
                    }
                },
                {
                    type: 'text',
                    z: 101,
                    left: 28,
                    top: 36,
                    style: {
                        text: 'Structural (Roads)',
                        font: '600 12px sans-serif',
                        fill: '#475569'
                    }
                },
                {
                    type: 'text',
                    z: 101,
                    left: 12,
                    top: 53,
                    style: {
                        text: '◀',
                        font: '14px sans-serif',
                        fill: '#ef4444' // Red
                    }
                },
                {
                    type: 'text',
                    z: 101,
                    left: 28,
                    top: 54,
                    style: {
                        text: 'Functional (Traffic)',
                        font: '600 12px sans-serif',
                        fill: '#475569'
                    }
                }
            ]
        }
    ],
    series: [
        {
            type: 'tree',
            data: [dendrogramData],
            top: '5%',
            left: '12%',
            bottom: '5%',
            right: '30%',
            symbolSize: 12,
            layout: 'orthogonal', // Forces straight branched lines
            orient: 'LR',         // Left to Right
            edgeShape: 'polyline',
            initialTreeDepth: 3,
            label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 12,
                fontWeight: 'bold',
                color: '#475569'
            },
            leaves: {
                label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left',
                    // Use a formatter to inject the colored triangles based on identity
                    formatter: function (params) {
                        if (params.data.identity === 'structural') {
                            return `{structural|◀} {text|${params.name}}`;
                        } else if (params.data.identity === 'functional') {
                            return `{functional|◀} {text|${params.name}}`;
                        }
                        return params.name;
                    },
                    rich: {
                        structural: {
                            color: '#2563eb', // Blue for Structure
                            fontSize: 16,
                            padding: [0, 4, 0, 0] // Adds a small gap between triangle and text
                        },
                        functional: {
                            color: '#ef4444', // Red for Function
                            fontSize: 16,
                            padding: [0, 4, 0, 0]
                        },
                        text: {
                            color: '#1e293b',
                            fontSize: 13,
                            fontWeight: 'bold'
                        }
                    }
                }
            },
            emphasis: {
                focus: 'descendant'
            },
            expandAndCollapse: false,
            animationDuration: 550,
            animationDurationUpdate: 750
        }
    ]
};

// Render the dendrogram
dendrogramChart.setOption(dendrogramOption);

// Resize handling
window.addEventListener('resize', () => {
    dendrogramChart.resize();
});