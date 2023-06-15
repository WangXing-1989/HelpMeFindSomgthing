import GHttp from "./GHttp";
import Main from "./Main";
import Model from "./Model";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Cover extends cc.Component {

    private main: Main;

    start () {
        this.main = cc.find("Canvas").getComponent(Main);
    }

    clickStartGameBtn() {
        // this.node.active = false;
        // this.main.startGame();


        // test code
        Model.instance.firstTaskSuccessCount = 1;
        Model.instance.firstTaskReaction = 1;
        Model.instance.secondTaskSuccessCount = 1;
        Model.instance.secondTaskReaction = 1;
        Model.instance.thirdTaskSuccessCount = 1;
        Model.instance.thirdTaskReaction = 1;
        Model.instance.LevelDifficultyEnd = 3;
        GHttp.instance.upLoadGameData();
    }
}
