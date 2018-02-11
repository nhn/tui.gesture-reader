### Load require files

```html
....
<script type="text/javascript" src="tui-code-snippet.js"></script>
<script type="text/javascript" src="tui-gesture-reader.js"></script>
....
```

* Require files must be loaded first.

### Create Gesture Reader for each gesture (such as flick, long tab, double click)
#### You can create instances with following options.
* Flick

   * flickTime : Available flick time
   * flickRange : Minimum distance to figure flick or back to the start point
   * minDist : Minimum distance to start to figure flick

* Long tab

   * longTabTerm : Term for figure tab is long tab or just tab
   * minDist : Minimum distance to quit figure log tab

* Double click

   * clickTime : Available term between each click.
   * maxDist : Available moment to figure double click

#### You can use Gesture flick component like/ next example.<br>
Next code is creating gesture reader for flick.

````javascript
var instance = new tui.Flick({
    flickRange: 50,
    flickTime: 100,
    minDist: 10
});

````

### Check Event type tutorial.

* You can use extractType to figure flick.

```javascript
var points = [
    {
        x: 50,
        y: 100
    },
    {
        x: 100,
        y: 150
    }
];
instance.extractType(points);

if(instance.type === 'flick') {
    console.log('this is flick');
}
```

### Check direction.

```javascript
var points = [
    {
        x: 50,
        y: 100
    },
    {
        x: 100,
        y: 150
    }
];
instance.getDirection(points);
```

* The method return N/S/W/E 4 directions.
