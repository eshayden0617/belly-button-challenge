// Set the URL to a variable
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';


// Function to update the demographic info panel
function updateDemographicInfo(metadata) {
    const metadataPanel = d3.select('#sample-metadata');
    metadataPanel.html(''); // This clears out previous data table

    // Iterate through metadata and display key-value pairs
    Object.entries(metadata).forEach(([key, value]) => {
        metadataPanel.append('p').text(`${key}:${value}`);
    });
}

// Display the default Bar chart
function createBarChart(data) {
    let sample_values = data.sample_values;
    let otu_ids = data.otu_ids;
    let otu_labels = data.otu_labels;
    // Slice the first 10 values that were the highest, use .reverse() since they are ordered
    // smallest to largest
    let trace = {
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).map(id => `OTU: ${id}`).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h',
    };

    let layout = {
        title: 'Top 10 OTUs',
        xaxis: { title: 'OTU Values' },
        yaxis: { title: 'OTU ID' },
        width: 600
    };

    Plotly.newPlot('bar', [trace], layout);
}

// Display the default Bubble chart
function createBubbleChart(data) {
    let otu_ids = data.otu_ids;
    let sample_values = data.sample_values;
    let otu_labels = data.otu_labels;

    let trace = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            // https://plotly.com/javascript/colorscales/ for fun colors ;)
            colorscale: 'Picnic',
            color: otu_ids,
            size: sample_values
        },
    };

    let layout = {
        title: 'OTU Bubble Chart',
        showlegend: false,
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'OTU Values' },
        height: 600,
        width: 1200
    };

    Plotly.newPlot('bubble', [trace], layout);
}

// Function to fetch and load data
function loadData() {
    // Load in the JSON from the URL
    d3.json(url).then(data => {
        const dropdown = d3.select('#selDataset');
        data.names.forEach(name => {
            dropdown.append('option').text(name).property('value', name);
        });

        // Initialize the dashboard with the first data points
        optionChanged(data.names[0], data);
    });
}

// Function to update the dashboard for new data that is selected
function optionChanged(selectedIndividual, data) {
    // Fetch data for the selected individual
    const individualData = data.samples.find(sample => sample.id === selectedIndividual);
    const metadata = data.metadata.find(metadata => metadata.id.toString() === selectedIndividual);

    // Update demographic
    updateDemographicInfo(metadata);

    // Create horizontal bar chart
    createBarChart(individualData);

    // Create bubble chart
    createBubbleChart(individualData);
}

// Initialize the dashboard
loadData();
