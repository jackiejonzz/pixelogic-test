class Person extends GameObject {
    constructor (config) {
        super(config)
        this.movingProgressRemaining = 0
        this.isStanding = false

        this.isPlayerControlled = config.isPlayerControlled || false

        this.directionUpdate = {
            "up" : ["y", -1],
            "down" : ["y", 1],
            "right" : ["x", 1],
            "left" : ["x", -1]

        }
    }

    update(state) {
        if (this.movingProgressRemaining > 0){
        this.updatePosition()}
        else {
            //more cases for walking characters herE???
        
            // case: keyboard ready & arrow pressed 
            if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow){
                this.startBehavior(state, {
                    type: "walk",
                    direction: state.arrow
                })    
            }

            this.updateSprite(state)


        }

    }

    startBehavior(state, behavior){

        //Set character direction to whatever behavior is
        this.direction = behavior.direction
        if (behavior.type=== "walk"){

        // stop here if wall
        if(state.map.isSpaceTaken(this.x, this.y, this.direction)){

            behavior.retry && setTimeout(()=>{
                this.startBehavior(state, behavior)
            }, 10)
            return
        }

        //ready 2 walk
        state.map.moveWall(this.x, this.y, this.direction)
        this.movingProgressRemaining = 24
        this.updateSprite(state)
    }

    if(behavior.type === "stand"){
        this.isStanding = true
        setTimeout(()=>{
            utilities.emitEvent("PersonStandComplete", {
                whoId: this.id
            })
            this.isStanding = false
        }, behavior.time)
    }
}

    updatePosition(){
            const [property, change] = this.directionUpdate[this.direction]
            this[property] += change
            this.movingProgressRemaining -=1
            if (this.movingProgressRemaining === 0){
                //done walking
                utilities.emitEvent("PersonWalkingComplete", {
                    whoId: this.id
                })
            }

    }


    updateSprite(){

        if(this.movingProgressRemaining > 0){
            this.sprite.setAnimation("walk-"+this.direction)
            return
        }
        this.sprite.setAnimation("idle-"+this.direction)

    }

    
}