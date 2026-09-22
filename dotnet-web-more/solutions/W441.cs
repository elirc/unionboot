// W441: Captured ILogger assertions / Structured Information event 100
namespace DotnetWeb;
public static class W441{

public static void Record(ILogger logger,string job,int count,Exception? error){
logger.Log(LogLevel.Information,new EventId(100,"job"),error,"Job {Job} processed {Count}",job,count);
}
}
