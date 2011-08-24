<?php

namespace Kailab\FrontendBundle\Templating\Helper;

use Symfony\Component\Templating\Helper\Helper;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Kailab\FrontendBundle\Entity\Screenshot;
use Kailab\FrontendBundle\Asset\AssetInterface;
use Kailab\FrontendBundle\Asset\ParameterAsset;
use Kailab\FrontendBundle\Asset\EmptyAsset;
use Imagine\ImageInterface;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;
use Imagine\Image\Point;
use Imagine\Image\Color;

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

    protected function getScreenshotSizes()
    {
        if(isset($this->config['screenshots']) && is_array($this->config['screenshots'])){
            return array_keys($this->config['screenshots']);
        }else{
            return array();
        }
    }

    protected function getScreenshotSize($size)
    {
        $info = array('width'=>null,'height'=>null,'route'=>null,
            'resize'=>null,'valign'=>null, 'halign'=>null);
        if(!isset($this->config['screenshots']) || !is_array($this->config['screenshots'])){
            return $info;
        }
        $config = $this->config['screenshots'];
        if(!isset($config[$size]) || !is_array($config[$size])){
            return $info;
        }
        return array_merge($info,$config[$size]);
    }

    protected function alignImage(ImageInterface $img, $size='small')
    {
        if(is_string($size)){
            $size = $this->getScreenshotSize($size);
        }
        if(!is_array($size)){
            return $img;
        }
        $old = $img->getSize();
        $size['width'] = $size['width'] && $size['halign'] ? $size['width'] : $old->getWidth();
        $size['height'] = $size['height'] && $size['valign'] ? $size['height'] : $old->getHeight();

        $imagine = new Imagine();
        $bg = $imagine->create(new Box($size['width'],$size['height']), new Color('ffffff',100));

        switch($size['valign']){
            default:
                $y = 0;
                break;
            case 'bottom':
                $y = $size['height']-$old->getHeight();
                break;
            case 'center':
                $y = ($size['height']-$old->getHeight())/2;
                break;
        }
        switch($size['halign']){
            default:
                $x = 0;
                break;
            case 'right':
                $x = $size['width']-$old->getWidth();
                break;
            case 'center':
                $x = ($size['width']-$old->getWidth())/2;
                break;
        }

        return $this->pasteImage($bg, $img,$x,$y);
    }

    protected function resizeImage(ImageInterface $img, $size='small', $orientation=null)
    {
        if(is_string($size)){
            $size = $this->getScreenshotSize($size);
        }
        if(!is_array($size)){
            return $img;
        }
        if(!$size['width'] && !$size['height']){
            return $img;
        }
        $old = $img->getSize();

        if($orientation==Screenshot::ORIENTATION_HORIZONTAL){
            $ratios = array(
                $size['width']/$old->getHeight(),
                $size['height']/$old->getWidth(),
            );
        }else{
            $ratios = array(
                $size['height']/$old->getHeight(),
                $size['width']/$old->getWidth(),
            );
        }
        
        $ratios = array_diff($ratios,array(0));

        if($size['resize'] == 'outside'){
            $r = max($ratios);
        }else{
            $r = min($ratios);
        }

        $box = new Box($old->getWidth()*$r, $old->getHeight()*$r);
        return $img->resize($box);
    }

    protected function pasteImage(ImageInterface $into, ImageInterface $from,$x,$y)
    {
        $into_size = $into->getSize();
        $from_size = $from->getSize();
        $x = $x < 0 ? 0 : $x;
        $y = $y < 0 ? 0 : $y;
        $dx = $into_size->getWidth() - $from_size->getWidth();
        $dy = $into_size->getHeight() - $from_size->getHeight();
        $x = $x > $dx ? $dx : $x;
        $y = $y > $dy ? $dy : $y;
        $point = new Point($x,$y);
        return $into->paste($from,$point);
    }

    public function combineScreenshotAsset(Screenshot $shot, $size='small')
    {
        $platform = $shot->getPlatform();
        $asset = $shot->getImage();

        if(!$platform->getId()){
            return $asset;
        }
        $imagine = new Imagine();

        // resize screen image
        try{
            $screen = $imagine->load($asset->getContent());
        }catch(\Exception $e){
            $screen = $imagine->create(new Box(1,1), new Color('0000ff'));
        }
        if($shot->getOrientation() == Screenshot::ORIENTATION_VERTICAL){
            $box = new Box($platform->getScreenW(), $platform->getScreenH());
        }else if($shot->getOrientation() == Screenshot::ORIENTATION_HORIZONTAL){
            $box = new Box($platform->getScreenH(), $platform->getScreenW());
        }
        $screen = $screen->thumbnail($box,ImageInterface::THUMBNAIL_OUTBOUND);

        $background = $platform->getBackground();
        if($background->getState()){
            $image = $imagine->load($background->getContent());
            if($shot->getOrientation() == Screenshot::ORIENTATION_HORIZONTAL){
                $image->rotate(90);
            }
            if($shot->getOrientation() == Screenshot::ORIENTATION_VERTICAL){
                $this->pasteImage($image,$screen,$platform->getScreenX(),$platform->getScreenY());
            }else if($shot->getOrientation() == Screenshot::ORIENTATION_HORIZONTAL){
                $this->pasteImage($image,$screen,$platform->getScreenY(),$platform->getScreenX());
            }
        }else{
            $image = $screen;
        }

        // resize everything
        $image = $this->resizeImage($image,$size,$shot->getOrientation());

        // align everything
        $image = $this->alignImage($image,$size);

        return new ParameterAsset(array(
            'content'       => $image->get('png'),
            'content_type'  => 'image/png'
        ));
    }

    public function html(Screenshot $shot, $size='small')
    {
        $html = '';
        $config = $this->getScreenshotSize($size);
        if(!$config['route']){
            return $html;
        }
        $platform = $shot->getPlatform();
        $slug = $platform->getSlug();
        $ori = $shot->getOrientation();
        $router = $this->container->get('router');
        $url = $router->generate($config['route'],array('id'=>$shot->getId()));
        $html .= '<img class="screenshot '.$size.'_size '.$slug.'_platform '.$ori.'_orientation" src="'.$url.'"/>';
        return $html;
    }

}
