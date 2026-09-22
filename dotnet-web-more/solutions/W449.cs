// W449: Captured ILogger assertions / Structured Error event 108
namespace DotnetWeb;
public static class W449{

public static void Record(ILogger logger,string job,int count,Exception? error){
logger.Log(LogLevel.Error,new EventId(108,"job"),error,"Job {Job} processed {Count}",job,count);
}
}
