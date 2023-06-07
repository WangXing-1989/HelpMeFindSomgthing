import Cover from "./Cover";
import Model from "./Model";
import Result from "./Result";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    @property(Result)
    result: Result = null;

    @property(cc.Node)
    cover: cc.Node = null;

    @property(cc.Node)
    article: cc.Node = null;

    start () {
        this.content.active = false;
        this.result.node.active = true;
        this.cover.active = true;
    }

    public startGame() {
        Model.instance.init();
        this.cover.active = false;
        this.content.active = true;
        this.showLianxi();
    }

    private showLianxi() {

    }

    // update (dt) {}
}
