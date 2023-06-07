
const {ccclass, property} = cc._decorator;

@ccclass
export default class Result extends cc.Component {

    @property(cc.Node)
    levelUp_1: cc.Node = null;

    @property(cc.Node)
    levelUp_2: cc.Node = null;

    @property(cc.Node)
    right: cc.Node = null;

    @property(cc.Node)
    wrong: cc.Node = null;

    @property(cc.Node)
    allRight: cc.Node = null;

    @property(cc.Node)
    fail: cc.Node = null;

    start () {
        this.node.active = false;
        this.hideAll();

        // this.scheduleOnce(this.showLevelUp_1, 2);
    }

    public showLevelUp_1() {
        this.playShow(this.levelUp_1);
    }

    public showLevelUp_2() {
        this.playShow(this.levelUp_2);
    }

    public showRight() {
        this.playShow(this.right);
    }

    public showWrong() {
        this.playShow(this.wrong);
    }

    public showAllRight() {
        this.playShow(this.allRight);
    }

    public showFail() {
        this.playShow(this.fail);
    }

    private playShow(dialog: cc.Node) {
        this.node.active = true;
        this.hideAll();
        dialog.active = true;
        dialog.scale = 0;
        cc.tween(dialog).to(0.5, { scale: 1 }, { easing: 'elasticOut' }).start();
    }

    private hideAll() {
        this.levelUp_1.active = false;
        this.levelUp_2.active = false;
        this.right.active = false;
        this.wrong.active = false;
        this.allRight.active = false;
        this.fail.active = false;
    }

    // update (dt) {}
}
