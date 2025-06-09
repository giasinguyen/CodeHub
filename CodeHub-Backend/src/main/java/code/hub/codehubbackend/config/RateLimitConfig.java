package code.hub.codehubbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.GenericFilterBean;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Configuration
public class RateLimitConfig {
    
    @Bean
    public RateLimitFilter rateLimitFilter() {
        return new RateLimitFilter();
    }
    
    public static class RateLimitFilter extends GenericFilterBean {
        
        private final ConcurrentHashMap<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();
        private final long timeWindowInMillis = TimeUnit.MINUTES.toMillis(1); // 1 minute window
        private final int maxRequestsPerWindow = 100; // 100 requests per minute
        
        @Override
        public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
                throws IOException, ServletException {
            
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            
            String clientIp = getClientIP(httpRequest);
            
            if (isRateLimited(clientIp)) {
                httpResponse.setStatus(429);
                httpResponse.getWriter().write("{\"error\":\"Too many requests\",\"message\":\"Rate limit exceeded\"}");
                httpResponse.setContentType("application/json");
                return;
            }
            
            chain.doFilter(request, response);
        }
        
        private boolean isRateLimited(String clientIp) {
            long currentTime = System.currentTimeMillis();
            
            requestCounts.compute(clientIp, (key, counter) -> {
                if (counter == null || currentTime - counter.windowStart > timeWindowInMillis) {
                    return new RequestCounter(currentTime, 1);
                } else {
                    counter.requestCount++;
                    return counter;
                }
            });
            
            RequestCounter counter = requestCounts.get(clientIp);
            return counter.requestCount > maxRequestsPerWindow;
        }
        
        private String getClientIP(HttpServletRequest request) {
            String xfHeader = request.getHeader("X-Forwarded-For");
            if (xfHeader == null) {
                return request.getRemoteAddr();
            }
            return xfHeader.split(",")[0];
        }
        
        private static class RequestCounter {
            long windowStart;
            int requestCount;
            
            RequestCounter(long windowStart, int requestCount) {
                this.windowStart = windowStart;
                this.requestCount = requestCount;
            }
        }
    }
}
