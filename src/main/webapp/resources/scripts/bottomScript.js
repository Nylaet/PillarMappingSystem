$(document).ready(function () {
    try {
        Muse.Utils.initWidget('.MenuBar', ['#bp_infinity'], function (elem) {
            return $(elem).museMenu();
        });/* unifiedNavBar */
        Muse.Utils.initWidget('#accordionu195', ['#bp_infinity'], function (elem) {
            return new WebPro.Widget.Accordion(elem, {canCloseAll: true, defaultIndex: -1});
        });/* #accordionu195 */
    } catch (e) {
        if (e && 'function' == typeof e.notify)
            e.notify();
        else
            Muse.Assert.fail('Error calling selector function:' + e);
    }
});



