import Toybox.Graphics;
import Toybox.WatchUi;
import Toybox.Lang;


class NotWalletView extends WatchUi.View {

    function initialize() {
        View.initialize();
    }

    function onLayout(dc as Dc) as Void {
        setLayout(Rez.Layouts.MainLayout(dc));
    }

    function onShow() as Void {
        // Set up labels
        var title = findDrawableById("Title") as WatchUi.Label;
        if (title != null) {
            title.setText("€BACH");
        }

        var subtitle = findDrawableById("Subtitle") as WatchUi.Label;
        if (subtitle != null) {
            subtitle.setText("Fixed supply: 12 million BACH");
        }

        var saldoTitle = findDrawableById("SaldoTitle") as WatchUi.Label;
        if (saldoTitle != null) {
            saldoTitle.setText("My saldo");
        }

        var saldoButton = findDrawableById("SaldoButton") as WatchUi.Button;
        if (saldoButton != null) {
            saldoButton.setText("10.624434723489 BACH");
        }
    }

    function onUpdate(dc as Dc) as Void {
        View.onUpdate(dc);

        // Draw a placeholder for the price graph
        var graphArea = findDrawableById("GraphArea") as WatchUi.Drawable;
        if (graphArea != null) {
            var x = graphArea.getX();
            var y = graphArea.getY();
            var w = graphArea.getWidth();
            var h = graphArea.getHeight();

            // Draw border
            dc.setColor(Graphics.COLOR_MID_GRAY, Graphics.COLOR_TRANSPARENT);
            dc.drawRectangle(x, y, w, h);

            // Example: Draw a simple zig-zag line as a placeholder
            var points = [
                [x, y + h/2],
                [x + w*0.2, y + h*0.3],
                [x + w*0.4, y + h*0.7],
                [x + w*0.6, y + h*0.2],
                [x + w*0.8, y + h*0.6],
                [x + w, y + h*0.4]
            ];
            dc.setColor(Graphics.COLOR_PURPLE, Graphics.COLOR_TRANSPARENT);
            for (var i = 0; i < points.size() - 1; i++) {
                dc.drawLine(points[i][0], points[i][1], points[i+1][0], points[i+1][1]);
            }
        }
    }

    function _pointInDrawable(drawable, x, y) as Boolean {
        if (drawable == null) { return false; }
        var dx = drawable.getX();
        var dy = drawable.getY();
        var dw = drawable.getWidth();
        var dh = drawable.getHeight();
        return (x >= dx && x <= dx + dw && y >= dy && y <= dy + dh);
    }

    function onTap(x as Number, y as Number) as Boolean {
        var title = findDrawableById("Title") as WatchUi.Label;
        if (_pointInDrawable(title, x, y)) {
            WatchUi.pushView(new BachInfoView(), null, WatchUi.SLIDE_UP);
            return true;
        }
        var saldoButton = findDrawableById("SaldoButton") as WatchUi.Button;
        if (_pointInDrawable(saldoButton, x, y)) {
            var transactions = [
                "Received 2.0 BACH",
                "Sent 0.5 BACH",
                "Received 0.1 BACH"
            ]; // Replace with real data source if available
            WatchUi.pushView(new TransactionListView(transactions), null, WatchUi.SLIDE_UP);
            return true;
        }
        return false;
    }

}
