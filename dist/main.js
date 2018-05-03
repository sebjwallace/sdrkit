
window.SDRKit = {

    // core
    SDR: require('../src/core/SDR'),
    SDRMap: require('../src/core/SDRMap'),
    SDRAMap: require('../src/core/SDRAMap'),
    SDRDictionary: require('../src/core/SDRDictionary'),
    SDRClassifier: require('../src/core/SDRClassifier'),
    Graph: require('../src/core/Graph'),

    // encoders
    encoders: {
        ImageEncoder: require('../src/core/encoders/ImageEncoder')
    },

    // util
    Partition: require('../src/util/Partition'),
    Load: require('../src/util/Load'),

    // visual
    notebook: require('../src/visual/Notebook'),
    visual: require('../src/visual/Visual')
    
}