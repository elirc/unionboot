// W443: Captured ILogger assertions / Structured Error event 102
namespace DotnetWeb;
public static class W443{

public static void Record(ILogger logger,string job,int count,Exception? error){
logger.Log(LogLevel.Error,new EventId(102,"job"),error,"Job {Job} processed {Count}",job,count);
}
}
