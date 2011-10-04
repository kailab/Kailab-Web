<?php

namespace Kailab\Bundle\SharedBundle\Imagine\Filter;

use Imagine\Filter\Basic\Crop as BaseCrop;
use Imagine\Gd\Imagine;
use Imagine\Image\BoxInterface;
use Imagine\Filter\FilterInterface;
use Imagine\ImageInterface;
use Imagine\Image\Color;
use Imagine\Image\Box;

use Kailab\Bundle\SharedBundle\Imagine\Image\Position;

/**
 *
 * Crops an image in a bounding box
 * @author mibero
 *
 */
class Crop implements FilterInterface
{
	const CENTER = "center";
	const LEFT = "left";
	const RIGHT = "right";
	const TOP = "top";
	const BOTTOM = "bottom";
	
	/**
	 * @var BoxInterface
	 */
	protected $size = null;
	
	protected $halign = self::CENTER;
	protected $valign = self::CENTER;
	
	public function __construct(BoxInterface $size, $halign=null, $valign=null)
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
		$this->size = $size;
	}
	
	/**
	* @return Position
	* @param ImageInterface $img
	*/
	protected function getPosition(ImageInterface $img)
	{
		$cropsize = $this->size;
		$imgsize = $img->getSize();
	
		switch($this->valign){
			case self::TOP:
				$y = 0;
				break;
			case self::BOTTOM:
				$y = $imgsize->getHeight() - $cropsize->getHeight();
				break;
			case self::CENTER:
				$y = ($imgsize->getHeight() - $cropsize->getHeight())/2;
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
				$x = $imgsize->getWidth() - $cropsize->getWidth();
				break;
			case self::CENTER:
				$x = ($imgsize->getWidth() - $cropsize->getWidth())/2;
				break;
				default:
				$x = (int) $this->halign;
				break;
		}
		return new Position($x, $y);
	}
	
	public function apply(ImageInterface $img)
	{
		$pos = $this->getPosition($img);
		if($pos->isNegative()){
			$imagine = new Imagine();
			$bg = $imagine->create($this->size, new Color('ffffff',100));
			$paste = new Paste($bg, $this->halign, $this->valign);
			$img = $paste->apply($img);
			$pos = $this->getPosition($img);
		}
		$crop = new BaseCrop($pos->getPoint(), $this->size);
		return $crop->apply($img);
	}
	
}