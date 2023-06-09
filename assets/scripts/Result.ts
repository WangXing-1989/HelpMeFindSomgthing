import Main from "./Main";
import Model from "./Model";

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

    private main: Main;

    start () {
        this.main = cc.find("Canvas").getComponent(Main);

        this.node.active = false;
        this.hideAll();
    }

    public showLevelUp_1() {
        this.playShow(this.levelUp_1);
        this.main.playAudio(this.main.successAudio);
    }

    public showLevelUp_2() {
        this.playShow(this.levelUp_2);
        this.main.playAudio(this.main.successAudio);

        let lihua = this.levelUp_2.getChildByName("lihua").getComponent(sp.Skeleton);
        lihua.setAnimation(0, "lihua", false);

        this.scheduleOnce(() => {
            this.node.active = false;
            Model.instance.levelUp() && this.main.showLianxi();
        }, 2);
    }

    public showRight() {
        this.playShow(this.right);
        this.main.playAudio(this.main.successAudio);
    }

    public showWrong() {
        this.playShow(this.wrong);
        this.main.playAudio(this.main.failAudio);
        Model.instance.fail();
    }

    public showAllRight() {
        this.playShow(this.allRight);
        this.main.playAudio(this.main.successAudio);
    }

    public showFail() {
        this.playShow(this.fail);
        this.main.playAudio(this.main.failAudio);
        Model.instance.fail();
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

    // 点击正确弹窗开始游戏按钮
    private clickStartGameBtn() {
        this.node.active = false;

        // Model.instance.levelUp();
        // this.main.showLianxi();

        this.showLevelUp_1();
    }

    // 点击错误弹窗再试一次按钮
    private clickTryItBtn() {
        this.node.active = false;
        this.main.showLianxi();
    }

    // 点击难度升级一弹窗开始训练按钮
    private clickStartXunLianBtn() {
        this.node.active = false;
        Model.instance.levelUp() && this.main.showLianxi();
    }

    // 点击通关弹窗再来一次按钮
    private clickPlayAgainBtn() {
        this.node.active = false;
        this.main.init();
    }

    // 点击失败弹窗再次尝试按钮
    private clickFailTryItBtn() {
        this.node.active = false;
        this.main.showLianxi();
    }
}
