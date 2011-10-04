<?php

namespace Kailab\Bundle\FrontendBundle\DependencyInjection;

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
        $rootNode = $treeBuilder->root('kailab_frontend');

        $rootNode
            ->children()
                ->scalarNode('site_name')->defaultValue('Kailab')->end()
                ->scalarNode('twitter')->defaultValue(null)->end()
        		->scalarNode('facebook')->defaultValue(null)->end()
        		->scalarNode('email')->defaultValue(null)->end()
            ->end();
        
        return $treeBuilder;
    }
}
