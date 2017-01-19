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
    {id: 6, label: 'Node 6',cid:'num'},
    {id: 7, label: 'Node 7',cid:'num'},
    {id: 8, label: 'Node 8',cid:'num'},
    {id: 9, label: 'Node 9',cid:'num'},

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
    {from: 6, to: 5},
    {from: 7, to: 6},
    {from: 2, to: 8},
    {from: 8, to: 9},

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
    if (childNodes.contains(node)) {
        return childNodes;
    }
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

var findEdgesOfChildNode = function(node,childEdges){
    var edges = network.getConnectedEdges(node);
    if(edges.length===0){
        return childEdges;
    }else{
        var l = edges.length-1;
        while(l>=0){
            var connectedNodes = network.getConnectedNodes(edges[l]);
            console.log(connectedNodes)
            if(connectedNodes[1]!==node&&!childEdges.contains(edges[l])){
                findEdgesOfChildNode(connectedNodes[1],childEdges);
                childEdges.push(edges[l]);
            }else{
                return childEdges;
            }
            l--;
        }
    }
};

var clusterByCid = function(node){
    //network.setData(data);
    var clusterOption = {
        joinCondition: function (nodeOptions) {
            //测试遍历子孙节点
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
    // 下为测试选中子孙节点
    //console.log(params);
    //var nodes = [];
    //var node = params.node;
    //console.log(params);
    //findChildrenOfNode(node,nodes);
    ////for(var node in nodes){
    ////
    ////    network.setOptions({color:'green'});
    ////}
    ////network.setOptions({edges:{dashes:true}});
    //network.selectNodes(nodes);

    // 下为测试选中子孙节点所连的边

    console.log(params);
    var edges = [];
    var node = params.node;
    console.log(params);
    findEdgesOfChildNode(node,edges);
    //for(var node in nodes){
    //
    //    network.setOptions({color:'green'});
    //}
    //network.setOptions({edges:{dashes:true}});
    network.selectEdges(edges);

});
network.on("blurNode",function(params){
    //console.log(params);
    //network.setOptions({edges:{color:'green'}});
    network.unselectAll();
});

var mockData = {
    nodes:[
        {serialNumber:'1',type:'server',cluster:'jiajike'},
        {serialNumber:'2',type:'server',cluster:'jiajike'},
        {serialNumber:'3',type:'server',cluster:'jiajike'},
        {serialNumber:'4',type:'server',cluster:'jiajike'},

        {serialNumber:'11',type:'uasg',idc:'sanshui'},
        {serialNumber:'12',type:'uasg',idc:'sanshui'},
        {serialNumber:'13',type:'uasg',idc:'sanshui'},

        {serialNumber:'21',type:'tma',idc:'sanshui'},
        {serialNumber:'22',type:'tma',idc:'sanshui'},
        {serialNumber:'23',type:'tma',idc:'sanshui'},
        {serialNumber:'24',type:'tma',idc:'sanshui'},
        {serialNumber:'25',type:'tma',idc:'sanshui'},

    ],
    connection:[
        {from:'21',to:'11'},
        {from:'22',to:'11'},
        {from:'23',to:'12'},
        {from:'24',to:'13'},
        {from:'11',to:'1'},
        {from:'12',to:'1'},
        {from:'13',to:'2'},
        {from:'13',to:'3'},
        {from:'12',to:'4'}

    ]
};

var transferContainer = document.getElementById('topo2')
var drawTransferTopo = function(container,data){

};
var initVisGraph = function (container, data, clusterOptionsByDatas) {
    var network = new vis.Network(container,data,option);
};