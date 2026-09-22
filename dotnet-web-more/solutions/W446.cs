// W446: Captured ILogger assertions / Structured Critical event 105
namespace DotnetWeb;
public static class W446{

public static void Record(ILogger logger,string job,int count,Exception? error){
logger.Log(LogLevel.Critical,new EventId(105,"job"),error,"Job {Job} processed {Count}",job,count);
}
}
