.. _render:

Render Tree
===========

Agile UI allows you to create and combine various objects into a single Render Tree for unified rendering. Tree represents
all the UI components that will contribute to the HTML generation. Render tree is automatically created and maintained::

    $view = new \atk4\ui\View();

    $view->add(new Button('test'));

    echo $view->render();

When render on the $view is executed, it will render button first then incorporate HTML into it's own template before rendering.

Here is a breakdown of how the above code works:

1. new instance of View is created and asigned to $view.
2. new instance of Button.
3. Button object is registered as a "pending child" of a view.

At this point Button is NOT element of a view just yet. This is because we can't be sure if $view will be rendered individually
or will become child of another view. Method init() is not executed on either objects.


4. render() method will call renderAll()
5. renderAll will find out that the $app property of a view is not set and will initialize it with default App.
6. renderAll will also find out that the init() has not been called for the $view and will call it.
7. init() will identify that there are some "pending children" and will add them in properly.

Most of the UI classes will allow you to operate even if they are not initialied. For instance calling 'setModel()' will
simply set a $model property and does not really need to rely on $api etc.

Next, lets look at what Initialization really is and why is it important.

Initialization
--------------

Calling init() method of a view is essential before any meaningfull work can be done with it. This is important, because
the following actions are performed:

 - template is loaded (or cloned from parent's template)
 - $app property is set
 - $short_name property is determined
 - unique $name is asigned.

Many of UI components rely on the above to function properly. For example Grid will look for certain regions in it's template
to clone them into separate objects. This cloning can only take place inside init() method.

Late initialization
-------------------

When you create an application and select a Layout, the layout is automatically initialized::

    $app = new \atk4\ui\App();
    $app->setLayout('Centered');

    echo $app->layout->name; // present, because layout is initalized!

After that, adding any objects into layout will initialize those objects too::

    $b = $app->layout->add(new Button('Test1'));o
    
    echo $b->name; // present, because button was added into initialized object.

If object cannot determine the path to the application, then it will remain uninitialized for some time. This is called
"Late initialization"::

    $v = new Buttons();
    $b2 = $v->add(new Button('Test2'));

    echo $b2->name; // not set!! Not part of render tree

At this point, if you execute $v->render() it will create it's own App and will create it's own render tree. On other hand
if you add $v inside layout, trees will merge and the same $app will be used::

    $app->layout->add($v);

    echo $b2->name; // fully set now and unique.

Agile UI will attempt to always initialize objects as soon as possible, so that you can get the most meaningful stack traces
should there be any problems with the initialization.


Rendering outside
-----------------

It's possible for some views to be rendered outside of the app. In the previous section I speculated that calling $v->render()
will create it's own tree independent from the main one. 

Agile UI sometimes uses the following approach to render element on the outside:

1. Create new instance of $sub_view.
2. Set $sub_view->id = false;
3. Calls $view->_add($sub_view);
4. executes $sub_view->renderHTML()

This returns a HTML that's stripped of any ID values, still linked to the main application but will not become part of the
render tree. This approach is useful when it's necessary to manipulate HTML and inject it directly into the template for
example when embedding UI elements into Grid Column.

Since Grid Column repeats the HTML many times, the ID values would be troublesome. Additionally, the render of a $sub_view
will be automatically embedded into the column and having it appear anywhere else on the page would be troublesome.

It's usually quite furtile to try and extract JS chains from the $sub_tree because JS wouldn't work anyways, so this method
will only work with static components.
