// W442: Captured ILogger assertions / Structured Warning event 101
namespace DotnetWeb;
public static class W442{

public static void Record(ILogger logger,string job,int count,Exception? error){
logger.Log(LogLevel.Warning,new EventId(101,"job"),error,"Job {Job} processed {Count}",job,count);
}
}
