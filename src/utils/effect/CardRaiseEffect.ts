/**
 * 升牌特效
 * @Author Ace.c
 * @Create 2016-11-28 16:25
 */
class CardRaiseEffect {

    static play(type: CardRaiseMode) {
        var cards: any[];
        var touchEnabled: boolean;
        switch (type) {
            case CardRaiseMode.funcmenu:
                cards = this.getCardsByFuncmenu();
                touchEnabled = false;
                break;
            case CardRaiseMode.changeThree:
                cards = game.changeThreeVo.getRecommend();
                touchEnabled = true;
                break;
        }

        if (cards && cards.length) {
            this.stop();

            for (var i: number = 0; i < cards.length; i++) {
                this.raise(cards[i]);
            }
        }
        else {
            this.stop()
        }
    }

    static stop() {
        var view: MJView = GSController.i.gsView.MJViews[1];
        view.resetAllChildrenTouch()
    }

    static raise(pai: any) {
        var view: MJView = GSController.i.gsView.MJViews[1];
        var card: CardView;

        for (var j: number = 0; j < view.handCon.numChildren; j++) {
            card = <CardView>view.handCon.getChildAt(j);
            if (!card || card.index < 0) {
                continue;
            }

            if (card.pai.type == pai.type && card.pai.number == pai.number && card.y == card.pos.y) {
                card.moveUp(false);
                return;
            }
        }
    }

    /**
     * 获取卡牌组, 通过功能菜单
     */
    private static getCardsByFuncmenu(): any[] {
        if (!GSData.i.funcSelects) {
            return [];
        }

        var cards: any[] = [];
        var handCards: any[] = PublicVal.i.getHandPais(1);
        var selectCards: any[] = GSData.i.funcSelects;

        /**
         * @param type 1单张 2所有
         * @param pai
         * @param jin 禁止添加的牌
         */
        function pushCard(type: number, pai: any, jin: number = -1) {
            // for (var i: number = 0; i < handCards.length; i++) {
            //     if (handCards[i].type == pai.type && handCards[i].number == pai.number) {
                    switch (type) {
                        case 1:
                            if (cards.indexOf(pai) != -1 || pai.number == jin)return;
                            cards.push(pai);
                            break;
                        case 2:
                            cards.push(pai);
                            break;
                    }
                // }
            // }
        }

        for (var i: number = 0; i < selectCards.length; i++) {
            var obj: any = selectCards[i];

            if (obj.index == 0 || obj.index == 5 || obj.index == 6) {
                continue;
            }

            switch (obj.index) {
                case 1://吃
                    for (var j: number = 0; j < obj.group.length; j++) {
                        for (var k: number = 0; k < obj.group[j].pai.length; k++) {
                            pushCard(1, obj.group[j].pai[k], obj.group[j].pai[1].number);
                        }
                    }
                    break;
                case 2://碰
                    for (var j: number = 0; j < obj.pai.length; j++) {
                        pushCard(2, obj.pai[j]);
                    }
                    break;
                case 3://杠
                case 4://补
                    for (var j: number = 0; j < obj.group.length; j++) {
                        switch (obj.group[j].action) {
                            case 27:
                            case 28:
                                pushCard(1, obj.group[j].pai);
                                break;
                            default:
                                for (var k: number = 0; k < obj.group[j].pai.length; k++) {
                                    var pai: any = obj.group[j].pai[k];
                                    switch (obj.group[j].action) {
                                        case 22:
                                        case 26:
                                            pushCard(1, pai);
                                            break;
                                        default:
                                            pushCard(2, pai);
                                            break;
                                    }
                                }
                                break;
                        }
                    }
                    break;
            }
        }

        return cards;
    }
}