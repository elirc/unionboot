// W448: Captured ILogger assertions / Structured Information event 107
namespace DotnetWeb;
public static class W448{

public static void Record(ILogger logger,string job,int count,Exception? error){
logger.Log(LogLevel.Information,new EventId(107,"job"),error,"Job {Job} processed {Count}",job,count);
}
}
