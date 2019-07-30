const playerStats = require('./rushing.json');

window.onload = () => {
    const table = new Table(document.querySelector('#mytable'), playerStats);
    const data = new Data(playerStats);

    let state = 'default';

    const sortableKeys = ['Yds', 'Lng', 'TD'];
    for (let key of sortableKeys) {
        document.querySelector(`#${key}`).onclick = () => {
            if (state == key) {
                state = 'Inv' + key;
                table.build(data.sort(key, 'desc'));
            } else {
                state = key;
                table.build(data.sort(key));
            }
        }
    }

    document.querySelector('#myInput').onkeyup = () => {
        const input = document.querySelector('#myInput').value;
        table.filterName(input);
    }

    document.querySelector('#download').onclick = () => {
        table.exportTableToCSV();
    }
}

class Table {
    constructor(table, data) {
        this.table = table;
        this.tbody = this.table.querySelector('tbody');
        this.playerStatKeys = Object.keys(data[0]);

        this.buildHeader();
        this.build(data);
    }

    clear() {
        this.tbody.innerHTML = '';
    }

    buildHeader() {
        const header = this.table.createTHead();
        const row = header.insertRow(0);

        for (let key of this.playerStatKeys) {
            const cell = row.insertCell(-1);
            cell.innerHTML = key;
            cell.id = key;
        }
    }

    build(data) {
        this.clear()
        for (let player of data) {
            this.addRow(player);
        }
        this.filterName(document.getElementById('myInput').value);
    }

    addRow(player) {
        const row = this.tbody.insertRow(-1);
        for (let key of this.playerStatKeys) {
            const cell = row.insertCell(-1);
            cell.innerHTML = `<td>${player[key]}</td>`;
        }
    }

    filterName(inputString) {
        const playerNameIndex = this.playerStatKeys.indexOf('Player');
        const string = inputString.toLowerCase();
        for (let row of this.tbody.getElementsByTagName('tr')) {
            let td = row.getElementsByTagName('td')[0];
            const playerName = td.textContent
            if (playerName.toLowerCase().indexOf(string) > -1) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }
    }

    downloadCSV(csv) {
        var csvFile;
        var downloadLink;

        // CSV file
        csvFile = new Blob([csv], {type: "text/csv"});

        // Download link
        downloadLink = document.createElement("a");

        // File name
        downloadLink.download = "NFL_rushing_data.csv";
        // Create a link to the file
        downloadLink.href = window.URL.createObjectURL(csvFile);

        // Hide download link
        downloadLink.style.display = "none";

        // Add the link to DOM
        document.body.appendChild(downloadLink);

        // Click download link
        downloadLink.click();
    }

    exportTableToCSV() {
        var csv = [];
        var rows = this.table.rows;

        for (var i = 0; i < rows.length; i++) {
            if (rows[i].style.display === "none") continue;
            var row = [], cols = rows[i].querySelectorAll("td, th");

            for (var j = 0; j < cols.length; j++)
                row.push(cols[j].innerText);

            csv.push(row.join(","));
        }

        // Download CSV file
        this.downloadCSV(csv.join("\n"),);
    }
}

class Data {
    constructor(data) {
        this.keys = Object.keys(data[0]);
        this.data = data;
    }

    sort(key, order) {
        order = order || 'asc';
        if (order === 'asc')
            return this.data.sort((a,b) => { return parseInt(b[key]) - parseInt(a[key]) });
        else
            return this.data.sort((b,a) => { return parseInt(b[key]) - parseInt(a[key]) });
    }
}
