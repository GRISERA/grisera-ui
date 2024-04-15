import AppearanceValues from './AppearanceValues';

export default { 
    bigFive:[
    {
        title: 'Openness',
    },
    {
        title: 'Neuroticism',
    },
    {
        title: 'Agreeableness',
    },
    {
        title: 'Conscientiousness',
    },
    {
        title: 'Extroversion',        
    }], 
    panas:[
        {
            title: 'Postive Affect Schedule',            
        },
        {
            title: 'Negative Affect Schedule',            
        },
    ],
    somatotype:[
        { 
            title: 'Ectomorph',            
        },
        { 
            title: 'Endomorph',            
        },
        { 
            title:'Mesomorph',           
        },
    ],
    appearanceOclusion: [
        {
            id: 'hasBeard',
            name: 'has beard',
            value: AppearanceValues.APPEARANCE_NO,
        },
        {
            id: 'hasMoustache',
            name: 'has moustache',
            value: AppearanceValues.APPEARANCE_NO,
        },
        {
            id: 'hasGlasses',
            name: 'has glasses',
            value: false,
        },
    ],
    arrangementDistanceValues:[
        'Intimate Zone', 
        'Casual Zone', 
        'Socio Consultative Zone',
        'Distance Public Zone',
    ],
};