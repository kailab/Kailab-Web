<?php

namespace Kailab\Bundle\SharedBundle\Imagine\Filter;

use Imagine\Filter\FilterInterface;
use Imagine\ImageInterface;

class Combined implements FilterInterface
{
	protected $filters = array();
	
	public function __construct()
	{
		$this->add(func_get_args());
	}
	
	public function add($filter)
	{
		if($filter instanceof FilterInterface){
			$this->filters[] = $filter;
		}else if(is_array($filter)){
			foreach($filter as $subfilter){
				$this->add($subfilter);
			}
		}
	}
	
	public function apply(ImageInterface $img)
	{
		foreach($this->filters as $filter){
			$img = $filter->apply($img);
		}
		return $img;
	}
}

?>