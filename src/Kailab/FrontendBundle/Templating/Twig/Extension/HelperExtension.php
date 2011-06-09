<?php

namespace Kailab\FrontendBundle\Templating\Twig\Extension;

use Symfony\Bundle\TwigBundle\TokenParser\RenderTokenParser;
use Symfony\Component\Templating\Helper\Helper;

/**
 * Adds a Helper as a global to the twig template.
 */
class HelperExtension extends \Twig_Extension
{
    private $helper;

    public function __construct(Helper $helper)
    {
        $this->helper = $helper;
    }

    public function initRuntime(\Twig_Environment $environment)
    {
        $environment->addGlobal($this->getName(),$this->helper);
    }

    public function getName()
    {
        return $this->helper->getName().'_helper';
    }
}
