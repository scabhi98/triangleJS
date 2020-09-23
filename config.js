

triangle.config('title', "My First App");

triangle.component('adder', {
    templateUrl: '/components/adder/template.html',
    controller: {
        scope: {a: 0, b: 0, c: 0},
        relate: function (){
            this.scope.c = parseFloat(this.scope.a) + parseFloat(this.scope.b);
        }
    }
});