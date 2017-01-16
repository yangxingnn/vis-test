/**
 * Created by yangx on 2017/1/15.
 */
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

var nodes = new vis.DataSet([
    {id: 'root', label: 'Node root'},

    {id: 't', label: 'Node t'},

    {id: 1, label: 'Node 1',cid:'num'},
    {id: 2, label: 'Node 2',cid:'num'},
    {id: 3, label: 'Node 3',cid:'num'},
    {id: 4, label: 'Node 4',cid:'num'},
    {id: 5, label: 'Node 5',cid:'num'},

    {id: 'a', label: 'Node a',cid:'char'},
    {id: 'b', label: 'Node b',cid:'char'},
    {id: 'c', label: 'Node c',cid:'char'},
    {id: 'd', label: 'Node d',cid:'char'},
    {id: 'e', label: 'Node e',cid:'char'}

]);

var edges = new vis.DataSet([
    {from: 'root', to: 1},
    {from: 'root', to: 'a'},

    {from: 1, to: 2},
    {from: 2, to: 3},
    {from: 2, to: 4},
    {from: 3, to: 5},

    {from: 'a', to: 'b'},
    {from: 'a', to: 'c'},
    {from: 'c', to: 'd'},
    {from: 'd', to: 'e'}
]);

var container = document.getElementById('topo');
container.setAttribute('background','red');
var data = {
    nodes:nodes,
    edges:edges
};
var option = {
    edges:{color:'green',selectionWidth:3},

    interaction:{hover:true}
};
var network = new vis.Network(container,data,option);

var findChildrenOfNode = function(node,childNodes){
    childNodes.push(node);
    var edges = network.getConnectedEdges(node);
    //console.log(edges);
    if(edges.length<=1){
        return childNodes;
    }else{
        var l = edges.length-1;
        while(l>=0){
            var connectedNodes = network.getConnectedNodes(edges[l]);
            console.log(connectedNodes)
            if(connectedNodes[1]!==node){
                findChildrenOfNode(connectedNodes[1],childNodes);
            }
            l--;
        }
    }
};

var clusterByCid = function(node){
    //network.setData(data);
    var clusterOption = {
        joinCondition: function (nodeOptions) {
            console.log(nodeOptions.id);
            //var nodes = findChildrenOfNode(node);
            var nodes = [];
            findChildrenOfNode(node,nodes);
            console.log(nodes);
            //var flag = (nodes.indexOf(nodeOptions.id) == 0);
            var flag = nodes.contains(nodeOptions.id);
            console.log(flag);
            return nodes.contains(nodeOptions.id);
        },
        clusterNodeProperties: {id:node+'cluster', borderWidth:3, shape:'database'}
    };
    network.cluster(clusterOption);

};

network.on("selectNode",function(params){
    console.log(params);
    console.log('aa')
    var node = params.nodes[0];
    if(network.isCluster(node)){
        network.openCluster(node);
    } else {
        if(node==='a'||node===1){
                clusterByCid(node);
        } else{
            console.log('start')
            var c = [];
            findChildrenOfNode(node,c);
            console.log(c)
        }
    }


});

network.on("hoverNode",function(params){
    console.log(params);
    var nodes = [];
    var node = params.node;
    console.log(params);
    findChildrenOfNode(node,nodes);
    //for(var node in nodes){
    //
    //    network.setOptions({color:'green'});
    //}
    //network.setOptions({edges:{dashes:true}});
    network.selectNodes(nodes);

});
network.on("blurNode",function(params){
    //console.log(params);
    //network.setOptions({edges:{color:'green'}});
    network.unselectAll();
});