//amount of proccesses in the desired IDEF0
processAmount = function(){

    var Pam = window.prompt("How many processes does your IDEF0 contain?");//asking user input 
    for (var i=0; i < Pam; i+=1){ //create i amount of proccesses
        paper.rect(IDF_Xmult*i,IDF_Ymult*i,IDF_WIDTH,IDF_HEIGHT);
        paper.text(IDF_Xmult*i + 0.32 *IDF_Xmult,IDF_Ymult*i + 0.55 * IDF_Ymult,'A'+(i+1)); //adding A0,...,An tags. 
        coords.push(IDF_Xmult*i,IDF_Ymult*i);//pushing the values of the coordinates of the processes to the coords global
        
    }
}

addArr = function(){ //adding the arrows
    for(var i=0; i < (coords.length - 2); i+=2){//for each process (so each 2nd coord) create the arrow, except for the last one

        var PathString =    'M'+(coords[i]+IDF_WIDTH)+' ' //Paths created between the processes.
                            +(coords[i+1]+0.5*IDF_HEIGHT)
                            +'H'+(coords[i]+1.5*IDF_WIDTH)
                            +'V'+(coords[i+1]+2*IDF_HEIGHT)
                            +'H'+(coords[i]+2.5*IDF_WIDTH);

        line = paper.path(PathString).attr({
    stroke: '#000000',
    'stroke-width': 2,
    'arrow-end':
        'classic-wide-long'
        });
    }
}