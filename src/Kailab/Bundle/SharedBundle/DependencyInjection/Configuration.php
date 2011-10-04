<?php

namespace Kailab\Bundle\SharedBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * This is the class that validates and merges configuration from your app/config files
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritDoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('kailab_shared');

        $rootNode
        ->children()
        	->scalarNode('mobile_version')
        	->end()
        	->arrayNode('locales')
        		->defaultValue(array('es', 'en'))
        		->addDefaultsIfNotSet()
        		->prototype('scalar')
        	->end()
        ->end();
        
        return $treeBuilder;
    }
}
