const $interaction = (function() {
    'use strict';

    const interactionIds = {

    };

    //등록된 interaction 목록 조회
    const getInteractions = function() {       
        return map.getInteractions().getArray();
    }
    
    //dratPan interaction 조회
    const getDragPan = function() {
        getInteractions().forEach(function(i) {
            if(i instanceof ol.interaction.DragPan) {
                return i;
            }
        });
    }

    //interactionId로 interaction 조회
    const getInteractionById = function(interactionId) {
        const interactions = getInteractions();
        for(let i in interactions) {
            const inter = interactions[i];
            const thisInterId = inter.get('id');

            if(thisInterId === interactionId) {
                return inter;
            }
        }
        return null;
    }

    //initialize
    const init = function() {
        //const map = $map.getMap();


    }

    return {
        interactionIds: interactionIds,

        init: init,
        getInteractionById: getInteractionById,
        getDragPan: getDragPan,
    }
} ());