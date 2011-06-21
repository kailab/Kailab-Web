<?php

namespace Kailab\FrontendBundle\Templating\Helper;

use Symfony\Component\Templating\Helper\Helper;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Kailab\FrontendBundle\Entity\Screenshot;

class ScreenshotHelper extends Helper
{
    private $container;
    private $config;

    public function __construct(ContainerInterface $container, array $config=array())
    {
        $this->container = $container;
        $this->config = $config;
    }

    public function getName()
    {
        return 'screenshot';
    }

    public function html(Screenshot $shot, $size='small')
    {
        $platform = $shot->getPlatform();
        $type = $platform->getSlug();
        $html = '';
        $html .= '<div class="screenshot_'.$size.' '.$type.'_type" style="">';
        $html .= '<div class="screen">';
        $html .= '</div>';
        $html .= '</div>';

        return $html;
    }

}
