package com.basira.tawsiah.ServiceImp;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


/*
From Rawi: 
    this logic will check the redis queue every 5 seconds and if any data found it will immeidatly pops queue
    and send it to fastAPI 

    withtout this code , the DEVOPS engineer has to do some complicated connections requiers password and alot of things 
    so consuming via spring and sending to fastAPI reduces effore for devops enginner to just only writing a simple small
    postrequest that i already commented below (under step 3)
*/

@Service
public class RedisConsumerService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final RestTemplate restTemplate;

    // This constructor "defines" the variables so you can use them
    public RedisConsumerService(RedisTemplate<String, Object> redisTemplate, RestTemplate restTemplate) {
        this.redisTemplate = redisTemplate;
        this.restTemplate = restTemplate;
    }

    // 1. Spring wakes up every 5 seconds
    @Scheduled(fixedDelay = 5000)
    public void processQueue() {
        // 2. Spring takes data out of Redis
        Object eventData = redisTemplate.opsForList().rightPop("event_sync_queue");

        if (eventData != null) {
            // 3. Spring PUSHES it to FastAPI

            try{
            //restTemplate.postForEntity("http://localhost:8000/sync-data", eventData, String.class);
            System.out.println("###########event Delivered data to FastAPI!");
        } catch (Exception e) {
            System.err.println("###########Error delivering event data to FastAPI: " + e.getMessage());
            }
        }   

        Object placeData = redisTemplate.opsForList().rightPop("place_sync_queue");

        if(placeData != null){
            restTemplate.postForEntity("http://localhost:8000/sync-data", placeData, String.class);
            System.out.println("place Delivered data to FastAPI!");
        }
    }
}