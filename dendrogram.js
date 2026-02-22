// INTERACTIVE DENDROGRAM LOGIC (ECHARTS)

// Initialize ECharts instance on the container
const dendrogramContainer = document.getElementById('dendrogram-container');
const dendrogramChart = echarts.init(dendrogramContainer);

// Define the hierarchical data based on the subgroup analysis
const dendrogramData = {
    name: 'Cortical\nMaps',
    children: [
        {
            name: 'Cluster 1\n(Structural)',
            itemStyle: { color: '#f97316' }, // Orange for Structural
            children: [
                {
                    name: 'PC1 & Myelin',
                    itemStyle: { color: '#f97316' },
                    children: [
                        { name: 'PC1 Gene Expression', value: 'Cluster 1: Strong coupling (ρ=0.84)', itemStyle: { color: '#f97316' } },
                        { name: 'T1w/T2w Ratio (Myelin)', value: 'Cluster 1: Strong coupling (ρ=0.84)', itemStyle: { color: '#f97316' } }
                    ]
                },
                { name: 'Glucose Metabolism', value: 'Cluster 1: Metabolic layer', itemStyle: { color: '#f97316' } }
            ]
        },
        {
            name: 'Cluster 2\n(Functional)',
            itemStyle: { color: '#22c55e' }, // Green for Functional
            children: [
                {
                    name: 'Thickness & 5-HT1a',
                    itemStyle: { color: '#22c55e' },
                    children: [
                        { name: 'Cortical Thickness', value: 'Cluster 2: Coupled with 5-HT1a', itemStyle: { color: '#22c55e' } },
                        { name: '5-HT1a Receptor', value: 'Cluster 2: Coupled with Thickness', itemStyle: { color: '#22c55e' } }
                    ]
                },
                {
                    name: 'Grad & Var',
                    itemStyle: { color: '#22c55e' },
                    children: [
                        { name: 'Functional Gradient', value: 'Cluster 2: Coupled with Variability', itemStyle: { color: '#22c55e' } },
                        { name: 'Intersubject Variability', value: 'Cluster 2: Coupled with Gradient', itemStyle: { color: '#22c55e' } }
                    ]
                },
                { name: 'Allometric Scaling (NIH)', value: 'Cluster 2: Morphological scaling', itemStyle: { color: '#22c55e' } }
            ]
        }
    ]
};

// Configure the chart options
const dendrogramOption = {
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        textStyle: { color: '#fff' },
        borderWidth: 0,
        formatter: function (params) {
            // Show custom descriptions for leaves, and names for parent nodes
            if (params.value) {
                return `<strong>${params.name}</strong><br/>${params.value}`;
            }
            return `<strong>${params.name.replace('\n', ' ')}</strong>`;
        }
    },
    series: [
        {
            type: 'tree',
            data: [dendrogramData],
            top: '5%',
            left: '12%',
            bottom: '5%',
            right: '30%',
            symbolSize: 12,
            layout: 'orthogonal', // Forces the straight, branched lines
            orient: 'LR',         // Left to Right orientation
            edgeShape: 'polyline', // Gives it the traditional dendrogram right-angles
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
                    fontSize: 13,
                    color: '#1e293b'
                }
            },
            emphasis: {
                focus: 'descendant' // Highlights the path when hovering
            },
            expandAndCollapse: false, // Keep it fully expanded
            animationDuration: 550,
            animationDurationUpdate: 750
        }
    ]
};

// Render the dendrogram
dendrogramChart.setOption(dendrogramOption);

// Ensure the chart resizes dynamically if the user resizes their browser window
window.addEventListener('resize', () => {
    dendrogramChart.resize();
});