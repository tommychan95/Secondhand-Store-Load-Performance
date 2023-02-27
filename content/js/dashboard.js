/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 75.55555555555556, "KoPercent": 24.444444444444443};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6694444444444444, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "PUT Edit Order (ID) (buyer-order)"], "isController": false}, {"data": [1.0, 500, 1500, "GET Fetch Orders (ID) (buyer-order)"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "POST Create Order (buyer-order)"], "isController": false}, {"data": [1.0, 500, 1500, "GET Register Account (ID) (seller-product)"], "isController": false}, {"data": [0.0, 500, 1500, "POST Fetch Products (seller-product)"], "isController": false}, {"data": [1.0, 500, 1500, "GET Fetch Products (ID) (buyer-product)"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "GET Fetch Orders (buyer-order)"], "isController": false}, {"data": [1.0, 500, 1500, "GET Fetch Products (buyer-product)"], "isController": false}, {"data": [0.3, 500, 1500, "POST Register Account (auth)"], "isController": false}, {"data": [0.0, 500, 1500, "DELETE Register Account (ID) (seller-product)"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "POST Login Account (auth)"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "GET Register Account (seller-product)"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 180, 44, 24.444444444444443, 567.7888888888888, 247, 3291, 283.0, 1020.7000000000007, 2654.8, 3060.149999999999, 0.012216673288556058, 0.07288128462154307, 0.3706793985131087], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PUT Edit Order (ID) (buyer-order)", 15, 5, 33.333333333333336, 275.93333333333334, 258, 319, 276.0, 298.6, 319.0, 319.0, 0.001018498374883993, 5.606382656018334E-4, 4.011663520864686E-4], "isController": false}, {"data": ["GET Fetch Orders (ID) (buyer-order)", 15, 0, 0.0, 275.6, 263, 347, 266.0, 328.40000000000003, 347.0, 347.0, 0.001018498098260351, 2.765063196449E-4, 3.550818565224075E-4], "isController": false}, {"data": ["POST Create Order (buyer-order)", 15, 5, 33.333333333333336, 277.4, 262, 290, 278.0, 289.4, 290.0, 290.0, 0.0010185001037851605, 5.670711515345504E-4, 4.21722699223543E-4], "isController": false}, {"data": ["GET Register Account (ID) (seller-product)", 15, 0, 0.0, 268.93333333333334, 261, 277, 268.0, 275.8, 277.0, 277.0, 0.001018498029104464, 7.827714344777472E-4, 3.580657133570381E-4], "isController": false}, {"data": ["POST Fetch Products (seller-product)", 15, 13, 86.66666666666667, 2735.4666666666662, 2506, 3291, 2675.0, 3120.0, 3291.0, 3291.0, 0.0010183275883816696, 3.8147506142891457E-4, 0.3663342008833788], "isController": false}, {"data": ["GET Fetch Products (ID) (buyer-product)", 15, 0, 0.0, 260.40000000000003, 253, 269, 260.0, 267.2, 269.0, 269.0, 0.0010185010719723781, 0.0010254634816440644, 3.5508289325599516E-4], "isController": false}, {"data": ["GET Fetch Orders (buyer-order)", 15, 0, 0.0, 880.0666666666666, 782, 1505, 798.0, 1263.8000000000002, 1505.0, 1505.0, 0.0010184622076173232, 0.06005213881476936, 3.491017918688286E-4], "isController": false}, {"data": ["GET Fetch Products (buyer-product)", 15, 0, 0.0, 290.2, 278, 323, 287.0, 309.2, 323.0, 323.0, 0.0010184988589757283, 0.0049850744933460445, 4.147597892508581E-4], "isController": false}, {"data": ["POST Register Account (auth)", 15, 6, 40.0, 579.6, 495, 753, 588.0, 681.6, 753.0, 753.0, 0.0010184665641500856, 6.20826981779769E-4, 5.98017574353491E-4], "isController": false}, {"data": ["DELETE Register Account (ID) (seller-product)", 15, 15, 100.0, 307.1333333333334, 247, 910, 263.0, 538.0000000000002, 910.0, 910.0, 0.001018499204755821, 3.5561271061884556E-4, 3.910877805761609E-4], "isController": false}, {"data": ["POST Login Account (auth)", 15, 0, 0.0, 353.3333333333333, 321, 587, 337.0, 443.6000000000001, 587.0, 587.0, 0.0010184864110487578, 5.221732087896464E-4, 4.48571651741201E-4], "isController": false}, {"data": ["GET Register Account (seller-product)", 15, 0, 0.0, 309.40000000000003, 266, 543, 282.0, 461.40000000000003, 543.0, 543.0, 0.0010184972683903262, 0.0027809749633001483, 3.520976884864995E-4], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 24, 54.54545454545455, 13.333333333333334], "isController": false}, {"data": ["500/Internal Server Error", 5, 11.363636363636363, 2.7777777777777777], "isController": false}, {"data": ["403/Forbidden", 5, 11.363636363636363, 2.7777777777777777], "isController": false}, {"data": ["404/Not Found", 10, 22.727272727272727, 5.555555555555555], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 180, 44, "400/Bad Request", 24, "404/Not Found", 10, "500/Internal Server Error", 5, "403/Forbidden", 5, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["PUT Edit Order (ID) (buyer-order)", 15, 5, "403/Forbidden", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Create Order (buyer-order)", 15, 5, "400/Bad Request", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Fetch Products (seller-product)", 15, 13, "400/Bad Request", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Register Account (auth)", 15, 6, "400/Bad Request", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["DELETE Register Account (ID) (seller-product)", 15, 15, "404/Not Found", 10, "500/Internal Server Error", 5, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
