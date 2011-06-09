<?php

namespace Kailab\BackendBundle\Templating\Twig\Extension;

use Symfony\Bundle\TwigBundle\TokenParser\RenderTokenParser;
use Kailab\BackendBundle\Templating\Helper\BackendHelper;

/**
 * Adds the Kailab BackendHelper as a global to the twig template.
 */
class BackendExtension extends \Twig_Extension
{
    private $helper;

    public function __construct(BackendHelper $helper)
    {
        $this->helper = $helper;
    }

    public function initRuntime(\Twig_Environment $environment)
    {
        $environment->addGlobal('backend',$this->helper);
    }

    public function getName()
    {
        return 'frontend';
    }

}
