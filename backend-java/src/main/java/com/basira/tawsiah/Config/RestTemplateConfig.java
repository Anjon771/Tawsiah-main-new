package com.basira.tawsiah.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.client.RestTemplate;


@Configuration
@EnableAsync
public class RestTemplateConfig {
    
    @Bean
    public RestTemplate restTemplate(){
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();

        // if cant reach AI in 5 seconds , give up 
        factory.setConnectionRequestTimeout(5000);
        // if AI connects but didnt send data for 5 minutes , give up 
        factory.setReadTimeout(5000);
        return new RestTemplate(factory);
    }
}
