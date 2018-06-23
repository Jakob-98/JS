// F0CUS CLASS DEFINITIONS

// CLASS ObjectWithXYWH (any drawable object)
class ObjectWithXYWH {
    constructor(cluster) {
      this.cluster = cluster;
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
    }

//CLASS ProcessStep
class ProcessStep extends ObjectWithXYWH {
    constructor(name) {
        this.name = name;
    }
}
//CLASS ProcessLink
class ProcessLink extends ObjectWithXYWH {
    constructor(name) {
        this.name = name;
    }
}


// CLASS MOUSEMANAGER
class MouseManager {
    constructor(name) {
        this.name = name;

    }

}