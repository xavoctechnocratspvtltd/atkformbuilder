<?php


class Admin extends \atk4\ui\App {

    public $title = 'Agile UI - Demo Application';
    
    function init(){
        parent::init();

        $this->initLayout('Admin');
        $m= $this->layout->menu->addMenu(['Front-end demo', 'icon'=>'puzzle'], ['index']);
        	$m->addItem(['Front-end demo', 'icon'=>'puzzle'], ['index']);
        	$m1=$m->addMenu(['Front-end demo', 'icon'=>'puzzle'], ['index']);
        		$m1->addItem(['Front-end demo', 'icon'=>'puzzle'], ['index']);
		$this->layout->menu->addMenu(['Admin demo', 'icon'=>'dashboard'], ['admin']);

        $layout = $this->layout; 

        $f = $layout->add(['Form']);
        $f->addField('hello');

        $f->onSubmit(function($f){
            return $f->error('hello',$f->get('hello'));

        });
		// $tabel = $this->add(['Table']);
		// $tabel->addColumn('Hello','TableColumn\Generic');

    }

}
