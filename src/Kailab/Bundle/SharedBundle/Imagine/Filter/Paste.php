<?php

namespace Kailab\Bundle\SharedBundle\Imagine\Filter;

use Imagine\Image\PointInterface;
use Imagine\Filter\Basic\Crop as BaseCrop;
use Imagine\Image\BoxInterface;
use Imagine\Filter\FilterInterface;
use Imagine\ImageInterface;
use Imagine\Image\Color;
use Imagine\Image\Box;
use Kailab\Bundle\SharedBundle\Imagine\Image\Position;

/**
 * 
 * Aligns an image in a bounding box
 * @author mibero
 *
 */
class Paste implements FilterInterface
{
	const CENTER = "center";
	const LEFT = "left";
	const RIGHT = "right";
	const TOP = "top";
	const BOTTOM = "bottom";
	
	protected $halign = self::CENTER;
	protected $valign = self::CENTER;
	
	/**
	 * @var Imagine\ImageInterface
	 */
	protected $background = null;
	
	public function __construct(ImageInterface $bg, $halign=null, $valign=null)
	{
		if($halign instanceof PointInterface){
			$this->halign = $halign->getX();
			$this->valign = $halign->getY();	
		}else{
			if($halign != null){
				$this->halign = $halign;
			}
			if($valign != null){
				$this->valign = $valign;
			}
		}
		$this->background = $bg;
	}
	
	function apply(ImageInterface $img)
	{	
		$pos = $this->getPosition($img);
		$img = $this->crop($img, $pos);
		return $this->paste($img, $pos);
	}
	
	/**
	 * @return Position
	 * @param ImageInterface $img
	 */
	protected function getPosition(ImageInterface $img)
	{
		$bgsize = $this->background->getSize();
		$imgsize = $img->getSize();
		
		switch($this->valign){
			case self::TOP:
				$y = 0;
				break;
			case self::BOTTOM:
				$y = $bgsize->getHeight() - $imgsize->getHeight();
				break;
			case self::CENTER:
				$y = ($bgsize->getHeight() - $imgsize->getHeight())/2;
				break;
			default:
				$y = (int) $this->valign;
			break;
		}
		switch($this->halign){
			case self::LEFT:
				$x = 0;
				break;
			case self::RIGHT:
				$x = $bgsize->getWidth() - $imgsize->getWidth();
				break;
			case self::CENTER:
				$x = ($bgsize->getWidth() - $imgsize->getWidth())/2;
				break;
			default:
				$x = (int) $this->halign;
			break;
		}
		return new Position($x, $y);
	}
	
	protected function crop(ImageInterface $img, Position $pos)
	{ 
		$x = $pos->getX() < 0 ? -1*$pos->getX() : 0;
		$y = $pos->getY() < 0 ? -1*$pos->getY() : 0;
		$bw = $this->background->getSize()->getWidth();
		$bh = $this->background->getSize()->getHeight();
		$bw -= $pos->getX() < 0 ? 0 : $pos->getX(); 
		$bh -= $pos->getY() < 0 ? 0 : $pos->getY();
		$w = $img->getSize()->getWidth() - $x;
		$h = $img->getSize()->getHeight() - $y;
		
		$size = new Box(min($w, $bw), min($h, $bh));
		$point = new Position($x, $y);
		$crop = new BaseCrop($point, $size);
		return $crop->apply($img);
	}
	
	protected function paste(ImageInterface $img, Position $pos)
	{
		$bgsize = $this->background->getSize();
		if($pos->getX() > $bgsize->getWidth()){
			return $bg;
		}
		if($pos->getY() > $bgsize->getHeight()){
			return $bg;
		}
		return $this->background->paste($img, $pos->getPoint());
	}
}