<?php

namespace Kailab\Bundle\SharedBundle\Imagine\Image;

use Imagine\Image\Point;

use Imagine\Image\BoxInterface;
use Imagine\Image\PointInterface;

final class Position implements PointInterface
{
	/**
	* @var integer
	*/
	private $x;
	
	/**
	 * @var integer
	 */
	private $y;
	
	/**
	 * Constructs a point of coordinates
	 *
	 * @param integer $x
	 * @param integer $y
	 *
	 */
	public function __construct($x, $y)
	{
		$this->x = (int) $x;
		$this->y = (int) $y;
	}
	
	/**
	 * 
	 * @return Point
	 */
	public function getPoint()
	{
		return new Point(
			$this->x > 0 ? $this->x : 0,
			$this->y > 0 ? $this->y : 0
		);
	}
	
	/**
	 * (non-PHPdoc)
	 * @see Imagine\Image\PointInterface::getX()
	 */
	public function getX()
	{
		return $this->x;
	}
	
	/**
	 * (non-PHPdoc)
	 * @see Imagine\Image\PointInterface::getY()
	 */
	public function getY()
	{
		return $this->y;
	}
	
	/**
	 * 
	 * @return bool
	 */
	public function isNegative()
	{
		return $this->x < 0 || $this->y < 0;
	}
	
	/**
	 * (non-PHPdoc)
	 * @see Imagine\Image\PointInterface::in()
	 */
	public function in(BoxInterface $box)
	{
		return !$this->isNegative() &&
			$this->x < $box->getWidth() &&
			$this->y < $box->getHeight();
	}
	
	/**
	 * (non-PHPdoc)
	 * @see Imagine\Image\PointInterface::__toString()
	 */
	public function __toString()
	{
		return sprintf('(%d, %d)', $this->x, $this->y);
	}
}