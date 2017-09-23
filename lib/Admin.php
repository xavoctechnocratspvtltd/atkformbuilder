<?php


class Admin extends \atk4\ui\App {

    public $title = 'Agile UI - Demo Application';
    
    function init(){
        parent::init();

        $this->initLayout('Admin');

        $layout = $this->layout; 

        $f = $layout->add(new \atk4\ui\Form());
        $f->addField('Hello');

    }

}
