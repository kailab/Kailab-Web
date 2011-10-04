<?php

namespace Kailab\Bundle\SharedBundle\Imagine\Filter;

use Imagine\Filter\Basic\Resize as BaseResize;
use Imagine\Filter\Basic\Rotate; 
use Imagine\Image\BoxInterface;
use Imagine\Filter\FilterInterface;
use Imagine\ImageInterface;
use Imagine\Image\Color;
use Imagine\Image\Box;

/**
 *
 * Resizes an image in a bounding box
 * @author mibero
 *
 */
class Resize implements FilterInterface
{
	const INSIDE = "inside";
	const OUTSIDE = "outside";
	const OUTSIDE_CROP = "outside_crop";

	/**
	* @var Imagine\Image\BoxInterface
	*/
	private $size;

	private $mode = self::INSIDE;
	private $rotation = 0;
	
	/**
	 * Constructs Resize filter with given width and height
	 *
	 * @param Imagine\Image\BoxInterface $size
	 */
	public function __construct(BoxInterface $size, $mode = null, $rotation = 0)
	{
		$this->size = $size;
		if($mode){
			$this->mode = $mode;
		}
		$this->rotation = $rotation;
	}
	
	/**
	 * @return BoxInterface
	 * @param BoxInterface $size
	 * @param unknown_type $rotation
	 */
	protected function rotateBox(BoxInterface $size, $rotation)
	{
		if($rotation == 0){
			return $size;
		}
		$rotation = deg2rad($rotation);
		return new Box(
			cos($rotation)*$size->getWidth() + sin($rotation)*$size->getHeight(),
			sin($rotation)*$size->getWidth() + cos($rotation)*$size->getHeight()
		);
	}
	
	public function setSizeRotation($rotation)
	{
		$this->size = $this->rotateBox($this->size, $rotation);
	}
	
	public function setImageRotation($rotation)
	{
		$this->rotation = (int) $rotation;
	}
	
	/**
	 * @return ImageInterface
	 * @see Imagine\Filter.FilterInterface::apply()
	 */
	public function apply(ImageInterface $img)
	{
		$old = $img->getSize();
		$old = $this->rotateBox($old, $this->rotation);

		$ratios = array(
			$this->size->getWidth()/$old->getWidth(),
			$this->size->getHeight()/$old->getHeight(),
		);
		$ratios = array_diff($ratios,array(0));
	
		$r = 1;
		if($this->mode == self::OUTSIDE || $this->mode == self::OUTSIDE_CROP){
			$r = max($ratios);
		}else if($this->mode == self::INSIDE){
			$r = min($ratios);
		}
		if($this->rotation != 0){
			$rotate = new Rotate($this->rotation);
			$img = $rotate->apply($img);
		}
		if($r != 1){
			$size = new Box($old->getWidth()*$r, $old->getHeight()*$r);
			$resize = new BaseResize($size);
			$img = $resize->apply($img);
		}
		
		if($this->mode == self::OUTSIDE_CROP){
			$crop = new Crop($this->size);
			$img = $crop->apply($img);
		}
		return $img;
	}
	
	
}