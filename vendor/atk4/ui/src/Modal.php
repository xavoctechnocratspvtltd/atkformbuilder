<?php

namespace atk4\ui;

/**
 * This class add modal dialog to a page.
 *
 * Modal are added to the layout but their content is hidden by default.
 * $modal->show() is the triggered needed to actually display the modal.
 *
 * Modal can be use as a regular view, simply by adding other view to it.
 *  $modal->add(['Message', 'title'=>'Welcome to Agile Toolkit')->text('Your text here').
 *
 * Modal can add content dynamically via CallbackLater.
 *  $modal->set(function ($modal) {
 *     $modal->add('Form');
 * });
 *
 * Modal can use semantic-ui predefine method onApprove or onDeny by passing
 * a jsAction to Modal::addDenyAction or Modal::addApproveAction method. It will not close until the jsAction return true.
 *  $modal->addDenyAction('No', new \atk4\ui\jsExpression('function(){window.alert("Can\'t do that."); return false;}'));
 *  $modal->addApproveAction('Yes', new \atk4\ui\jsExpression('function(){window.alert("You\'re good to go!");}'));
 *
 * You may also prevent modal from closing via the esc or dimmed area click using $modal->notClosable().
 *
 * Some helper methods are also available to set: transition time, transition type or modal settings from semantic-ui.
 */
class Modal extends View
{
    public $defaultTemplate = 'modal.html';
    public $title = 'Modal title';
    public $ui = 'modal';
    public $fx = [];
    public $cb = null;
    public $cb_view = null;

    public function init()
    {
        parent::init();
        $this->template->trySet('title', $this->title);
    }

    /**
     * Set callback function for this modal.
     *
     * @param array|string $fx
     * @param array|string $arg2
     *
     * @throws Exception
     *
     * @return $this
     */
    public function set($fx = [], $arg2 = null)
    {
        if (!is_object($fx) && !($fx instanceof Closure)) {
            throw new Exception('Error: Need to pass a function to Modal::set()');
        }
        $this->fx = [$fx];
        $this->enableCallback();

        return $this;
    }

    /**
     * Add View to be loaded in this modal and
     * attach CallbackLater to it.
     * The cb_view only will be loaded dynamically within modal
     * div.atk-content.
     */
    public function enableCallback()
    {
        $this->cb_view = $this->add('View');
        $this->cb = $this->cb_view->add('CallbackLater');

        $this->cb->set(function () {
            if ($this->cb->triggered && $this->fx) {
                $this->fx[0]($this->cb_view);
            }
            $this->app->terminate($this->cb_view->renderJSON());
        });
    }

    /**
     * Set modal to show on page.
     * Will trigger modal to be show on page.
     * ex: $button->on('click', $modal->show());.
     *
     * @return mixed
     */
    public function show()
    {
        return $this->js()->modal('show');
    }

    /**
     * Set modal option.
     *
     * @param $option
     * @param $value
     *
     * @return $this
     */
    public function setOption($option, $value)
    {
        $this->options['modal_option'][$option] = $value;

        return $this;
    }

    /**
     * Set modal options passing an array.
     *
     * @param $options
     *
     * @return $this
     */
    public function setOptions($options)
    {
        if (isset($this->options['modal_option'])) {
            $this->options['modal_option'] = array_merge($this->options['modal_option'], $options);
        } else {
            $this->options['modal_option'] = $options;
        }

        return $this;
    }

    /**
     * Add scrolling capability to modal.
     *
     * @return $this
     */
    public function addScrolling()
    {
        $this->addClass('scrolling');

        return $this;
    }

    /**
     * Set modal transition.
     *
     * @param $transition_type
     *
     * @return $this
     */
    public function transition($transition_type)
    {
        $this->settings('transition', $transition_type);

        return $this;
    }

    /**
     * Set modal transition duration.
     *
     * @param $time
     *
     * @return $this
     */
    public function duration($time)
    {
        $this->settings('duration', $time);

        return $this;
    }

    /**
     * Add modal settings.
     *
     * @param $setting_option
     * @param $value
     */
    public function settings($setting_option, $value)
    {
        $this->options['setting'][$setting_option] = $value;
    }

    /**
     * Add a deny action to modal.
     *
     * @param $label.
     * @param $jsAction : Javascript action that will run when deny is click.
     *
     * @return $this
     */
    public function addDenyAction($label, $jsAction)
    {
        $b = new Button();
        $b->set($label)->addClass('red cancel');
        $this->addButtonAction($b);
        $this->options['modal_option']['onDeny'] = $jsAction;

        return $this;
    }

    /**
     * Add an approve action button to modal.
     *
     * @param $label.
     * @param $jsAction : Javascript action that will run when approve is click.
     *
     * @return $this
     */
    public function addApproveAction($label, $jsAction)
    {
        $b = new Button();
        $b->set($label)->addClass('green ok');
        $this->addButtonAction($b);
        $this->options['modal_option']['onApprove'] = $jsAction;

        return $this;
    }

    /**
     * Add an action button to modal.
     *
     * @param $button
     *
     * @return $this
     */
    public function addButtonAction($button)
    {
        $this->add($button, 'actions');

        return $this;
    }

    /**
     * Make this modal not closable via close icon, esc key or via the dimmer area.
     *
     * @return $this
     */
    public function notClosable()
    {
        $this->options['modal_option']['closable'] = false;

        return $this;
    }

    public function renderView()
    {
        if (!empty($this->fx)) {
            $this->template->trySet('uri', $this->cb->getURL());
        }

        // call modal creation first
        if (isset($this->options['modal_option'])) {
            $this->js(true)->modal($this->options['modal_option']);
        } else {
            $this->js(true)->modal();
        }

        //add setting if available.
        if (isset($this->options['setting'])) {
            foreach ($this->options['setting'] as $key => $value) {
                $this->js(true)->modal('setting', $key, $value);
            }
        }

        if (!isset($this->options['modal_option']['closable']) || $this->options['modal_option']['closable']) {
            $this->template->trySet('close', 'icon close');
        }

        parent::renderView();
    }
}
