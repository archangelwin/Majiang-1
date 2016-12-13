/**
 * GameCore
 * @Author Ace.c
 * @Create 2016-12-05 16:08
 */
class game {

    static stage: egret.Stage;

    static gameType: GameType = GameType.sichuan;

    //游戏存储key
    static get gameKey(): string {
        var key: string = "mqkj-";
        switch (game.gameType) {
            case GameType.sichuan:
                key += "scmj-";
                break;
        }
        return key;
    }

    //管理
    static manager: GameManager = GameManager.i;

    //规则
    static ruleVo: GameRuleVo;
    //换三张
    static changeThreeVo: ChangeThreeVo;
    //是否正在换牌中
    static isChangeThreeBoo: boolean = false;
    //是否正在订缺中
    static isQueBoo: boolean = false;
    //是否正在胡牌中
    static isHuBoo: boolean = false;

    //当前状态
    static status: GameStatus = GameStatus.gamestart;
    //当前状态是否完成
    static statusComplete: boolean = false;
    //全部玩家的缺门记录
    static allQue: any = {};

    static init(stage) {

        acekit.init(stage);

        this.stage = stage;

        this.manager.init();

        game.ruleVo = new GameRuleVo();
        game.changeThreeVo = new ChangeThreeVo();

        if (!GameLocal.getData(GameLocal.music)) GameLocal.setData(GameLocal.music, 1);
        if (!GameLocal.getData(GameLocal.musicVolume)) GameLocal.setData(GameLocal.musicVolume, 20);
        if (!GameLocal.getData(GameLocal.sound)) GameLocal.setData(GameLocal.sound, 1);
        if (!GameLocal.getData(GameLocal.soundVolume)) GameLocal.setData(GameLocal.soundVolume, 50);
        if (!GameLocal.getData(GameLocal.style)) GameLocal.setData(GameLocal.style, 1);
        if (!GameLocal.getData(GameLocal.color)) GameLocal.setData(GameLocal.color, 1);

        GameMusic._volume = +GameLocal.getData(GameLocal.musicVolume);
        GameSound._volume = +GameLocal.getData(GameLocal.soundVolume);

        GlobalData.getInstance().cardStyle = +GameLocal.getData(GameLocal.style);
        GlobalData.getInstance().cardColor = +GameLocal.getData(GameLocal.color);

        GameParse.Initialization();

        stage.addChild(LayerManager.gameLayer());
    }

    /**
     * 游戏开始前状态
     */
    static prestart() {
        this.status = GameStatus.unknow;
        this.statusComplete = false;
        this.allQue = {};
        this.isHuBoo = false;
        game.manager.dispatchEvent(GameEvent.CleanAll);
    }

    /**
     * 获取最短的牌类型
     * @param limitLength 最低限制长度(大于等于该长度, 默认为-1不限制)
     * @returns {any}
     */
    static getCtShortest(limitLength: number = -1): CardType {
        var list: any[][] = [
            [CardType.wan, game.getCtLength(CardType.wan)],
            [CardType.tiao, game.getCtLength(CardType.tiao)],
            [CardType.tong, game.getCtLength(CardType.tong)]
        ];

        list.sort(function (a, b) {
            if (a[1] < b[1]) {
                return -1;
            }
            else if (a[1] > b[1]) {
                return 1;
            }
            else {
                return 0;
            }
        });

        if (limitLength == -1) {
            return list[0][0];
        }
        else {
            for (var i: number = 0; i < list.length; i++) {
                length = list[i][1];
                if (list[i][1] >= limitLength) {
                    return list[i][0];
                }
            }
        }
    }

    /**
     * 获取某个类型牌的手牌长度
     * @param type
     * @returns {number}
     */
    static getCtLength(type: CardType): number {
        var handCards: any[] = PublicVal.i.getHandPais(1);
        var length: number = 0;
        var card: any;
        if (handCards) {
            for (var i: number = 0; i < handCards.length; i++) {
                card = handCards[i];
                if (card && card.type == type) {
                    length++;
                }
            }
        }
        return length;
    }

    /**
     * 获取某个类型牌的手牌序列
     * @param type
     * @param length
     * @returns {any[]}
     */
    static getCtCards(type: CardType, length: number = -1): any[] {
        var handCards: any[] = PublicVal.i.getHandPais(1);
        var cards: any[] = [];
        var card: any;

        if (handCards) {
            for (var i: number = 0; i < handCards.length; i++) {
                card = handCards[i];
                if (card && card.type == type) {
                    cards.push(card);
                }

                if (length != -1 && cards.length == length) {
                    break;
                }
            }
        }
        return cards;
    }
}