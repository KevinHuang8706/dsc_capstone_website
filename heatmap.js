const maps = [
    "PC1 Gene Expression",
    "T1w/T2w Ratio (Myelin)",
    "Cortical Thickness",
    "Allometric Scaling (NIH)",
    "5-HT1a Receptor",
    "Functional Gradient",
    "Glucose Metabolism",
    "Intersubject Variability"
];

// Exact correlations updated from your latest python output
const corrData = [
    [ 1.000,  0.840, -0.663, -0.117, -0.688, -0.595,  0.341, -0.476],
    [ 0.840,  1.000, -0.543, -0.151, -0.662, -0.613,  0.309, -0.496],
    [-0.663, -0.543,  1.000,  0.143,  0.600,  0.390, -0.360,  0.265],
    [-0.117, -0.151,  0.143,  1.000,  0.200,  0.241,  0.025,  0.356],
    [-0.688, -0.662,  0.600,  0.200,  1.000,  0.507, -0.402,  0.473],
    [-0.595, -0.613,  0.390,  0.241,  0.507,  1.000,  0.079,  0.602],
    [ 0.341,  0.309, -0.360,  0.025, -0.402,  0.079,  1.000,  0.109],
    [-0.476, -0.496,  0.265,  0.356,  0.473,  0.602,  0.109,  1.000]
];

// P-values extracted from the provided spatial spin test table.
const pData = [
    [0.000000, 0.000999, 0.000999, 0.427572, 0.000999, 0.000999, 0.142857, 0.021978],
    [0.000999, 0.000000, 0.000999, 0.262737, 0.000999, 0.000999, 0.095904, 0.000999],
    [0.000999, 0.000999, 0.000000, 0.317682, 0.000999, 0.009990, 0.022977, 0.114885],
    [0.427572, 0.262737, 0.317682, 0.000000, 0.403596, 0.210789, 0.914086, 0.025974],
    [0.000999, 0.000999, 0.000999, 0.403596, 0.000000, 0.000999, 0.008991, 0.004995],
    [0.000999, 0.000999, 0.009990, 0.210789, 0.000999, 0.000000, 0.651349, 0.000999],
    [0.142857, 0.095904, 0.022977, 0.914086, 0.008991, 0.651349, 0.000000, 0.630370],
    [0.021978, 0.000999, 0.114885, 0.025974, 0.004995, 0.000999, 0.630370, 0.000000]
];

const container = document.getElementById('correlationMatrix');
const tooltip = document.getElementById('tooltip');

// Function to determine cell color based on correlation value
function getColor(value) {
    const intensity = Math.abs(value);
    if (value > 0) {
        // Positive (+1) -> Red (var(--chemical-color) equivalent)
        return `rgba(239, 68, 68, ${intensity})`;
    } else if (value < 0) {
        // Negative (-1) -> Blue (var(--structure-color) equivalent)
        return `rgba(37, 99, 235, ${intensity})`;
    }
    return `rgba(255, 255, 255, 1)`; // Zero -> White
}

// 1. Create Top-Left Empty Corner
const emptyCorner = document.createElement('div');
container.appendChild(emptyCorner);

// 2. Create Top Column Labels
maps.forEach((map, colIndex) => {
    const label = document.createElement('div');
    label.className = `matrix-label top-label col-label-${colIndex}`;
    label.innerText = map;
    container.appendChild(label);
});

// 3. Create Rows (Left Label + Data Cells)
corrData.forEach((row, rowIndex) => {
    // Row Label
    const rowLabel = document.createElement('div');
    rowLabel.className = `matrix-label left-label row-label-${rowIndex}`;
    rowLabel.innerText = maps[rowIndex];
    container.appendChild(rowLabel);

    // Data Cells
    row.forEach((value, colIndex) => {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell data-cell';
        cell.style.backgroundColor = getColor(value);
        
        // Add exact value if it's strong enough to read clearly
        if(Math.abs(value) > 0.4 && rowIndex !== colIndex) {
            cell.style.color = 'white';
            cell.style.fontWeight = 'bold';
            cell.innerText = value.toFixed(2);
        } else if (rowIndex === colIndex) {
            cell.innerText = '1.0';
            cell.style.color = 'white';
        }

        // Hover interactions
        cell.addEventListener('mouseenter', (e) => {
            // Highlight Labels
            document.querySelector(`.row-label-${rowIndex}`).classList.add('label-highlight');
            document.querySelector(`.col-label-${colIndex}`).classList.add('label-highlight');

            // Fetch formatting logic for tooltip
            const pVal = pData[rowIndex][colIndex];
            let pStr = pVal === 0 ? "N/A (Self)" : (pVal < 0.001 ? "< 0.001" : pVal.toFixed(4));

            // Show Tooltip with Correlation & P-value on the same line
            tooltip.innerHTML = `
                <strong>${maps[rowIndex]}</strong> vs <strong>${maps[colIndex]}</strong><br>
                Correlation (ρ): ${value.toFixed(3)}, p-value: ${pStr}
            `;
            tooltip.style.opacity = 1;
        });

        cell.addEventListener('mousemove', (e) => {
            // Position Tooltip dynamically
            const rect = container.getBoundingClientRect();
            tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
            tooltip.style.top = (e.clientY - rect.top + 15) + 'px';
        });

        cell.addEventListener('mouseleave', () => {
            // Remove Highlight
            document.querySelector(`.row-label-${rowIndex}`).classList.remove('label-highlight');
            document.querySelector(`.col-label-${colIndex}`).classList.remove('label-highlight');
            
            // Hide Tooltip
            tooltip.style.opacity = 0;
        });

        container.appendChild(cell);
    });
});