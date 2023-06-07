import Main from "./Main";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Cover extends cc.Component {

    private main: Main;

    start () {
        this.main = cc.find("Canvas").getComponent(Main);
    }

    clickStartGameBtn() {
        this.node.active = false;
        this.main.startGame();
    }
}
