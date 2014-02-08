(function() {
  $(document).keypress(function(e) {
    switch (e.keyCode) {
      case 122:
        Game.addMoney(100000);
        break;
      case 120:
        Game.data.days = 2;
        break;
      case 99:
        Game.data.risk = 99;
        RiskMeter.update();
        break;
      case 109:
        Game.addMoney(1000);
        break;
      default: 
        break;
    }
  });
})();
