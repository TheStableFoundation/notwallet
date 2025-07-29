import Toybox.Lang;
import Toybox.WatchUi;

class NotWalletDelegate extends WatchUi.BehaviorDelegate {

    function initialize() {
        BehaviorDelegate.initialize();
    }

    function onMenu() as Boolean {
        WatchUi.pushView(new Rez.Menus.MainMenu(), new NotWalletMenuDelegate(), WatchUi.SLIDE_UP);
        return true;
    }

}